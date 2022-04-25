import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';

@Component({
    selector: 'app-group-chat-top',
    templateUrl: './group-chat-top.component.html',
    styleUrls: ['./group-chat-top.component.scss'],
    providers: [{provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper}]
})
export class GroupChatTopComponent implements OnInit, OnDestroy {
    @Input() authUser;
    @Input() selectedGroup;

    subscriptions: Subscription[] = [];

    constructor(
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupMessagesStore: GroupsMessagesSubjectService,
        private isEmptyObj: CheckForEmptyObjectPipe,
        public mobileHelper: MobileResponsiveHelper,
    ) {

    }

    ngOnInit(): void {

    }

    isChatTopShown() {
        return this.isEmptyObj.transform(this.selectedGroup);
    }

    backToUsers() {
        // this.groupMessagesStore.changeGroup({});
        this.groupMessagesStore.showResponsiveChatBox = false;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
