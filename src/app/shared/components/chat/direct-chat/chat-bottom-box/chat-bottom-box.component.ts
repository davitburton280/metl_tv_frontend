import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {UsersService} from '@core/services/users.service';
import {Subscription} from 'rxjs';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {DirectChatMessagesComponent} from '@shared/components/chat/direct-chat/direct-chat-messages/direct-chat-messages.component';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {Router} from '@angular/router';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';

@Component({
    selector: 'app-chat-bottom-box',
    templateUrl: './chat-bottom-box.component.html',
    styleUrls: ['./chat-bottom-box.component.scss'],
    providers: [DirectChatMessagesComponent]
})
export class ChatBottomBoxComponent implements OnInit, OnDestroy {
    authUser;

    messages = [];

    subscriptions: Subscription[] = [];
    isChannelPage = false;


    @Input() channelUser;
    @Input() selectedGroup;
    @Input() chatBoxType = 'direct';


    constructor(
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private chatService: ChatService,
        private socketService: SocketIoService,
        private usersService: UsersService,
        private usersMessagesStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private isEmptyObj: CheckForEmptyObjectPipe,
        public router: Router
    ) {
    }

    ngOnInit(): void {

        this.isChannelPage = this.router.url.includes('channels/show');
        this.authUser = this.getAuthUser.transform();
        this.trackSelectedUser();
        this.trackSelectedGroup();
    }

    trackSelectedUser() {
        this.usersMessagesStore.selectedUserMessages$.subscribe(selectedUser => {
            if (!selectedUser) {
                this.usersMessagesStore.showBottomChatBox = false;
            }
        });
    }

    trackSelectedGroup() {
        this.groupsMessagesStore.selectedGroupsMessages$.subscribe(selectedGroup => {
            if (this.isEmptyObj.transform(selectedGroup)) {
                this.groupsMessagesStore.showBottomChatBox = false;
            }
        });
    }

    closeChatBox() {
        if (this.chatBoxType === 'direct') {
            this.usersMessagesStore.showBottomChatBox = false;
        } else {
            this.groupsMessagesStore.showBottomChatBox = false;
        }

    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
