import {AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {SharedChatHelper} from '@core/helpers/shared-chat-helper';

@Component({
    selector: 'app-group-chat-messages',
    templateUrl: './group-chat-messages.component.html',
    styleUrls: ['./group-chat-messages.component.scss']
})
export class GroupChatMessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
    @Input() authUser;
    @Input() selectedGroupMessages;
    @Input() embedMode = false;

    @ViewChild('groupMessagesList') private messagesList: ElementRef;

    subscriptions: Subscription[] = [];
    groupsTypingMessages = [];

    typingText = {
        id: null,
        group: false,
        text: ''
    };


    constructor(
        private chatService: ChatService,
        private groupByDate: GroupByPipe,
        private socketService: SocketIoService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        public sHelper: SharedChatHelper
    ) {
    }

    ngOnInit(): void {
        this.getSeen();
        this.getTyping();
        this.getMessagesFromSocket();
        this.trackGroupMessagesChange();
    }

    trackGroupMessagesChange() {
        this.subscriptions.push(this.groupsMessagesStore.selectedGroupsMessages$.subscribe((dt: any) => {
            this.selectedGroupMessages = dt;
        }));
    }

    getMessagesByDate(dt) {
        return this.groupByDate.transform(dt, 'created_at');
    }

    setSeen(formValue) {
        const {owned, lastMessage} = this.sHelper.isLastMsgOwn(this.selectedGroupMessages.group_messages);

        if (!owned && lastMessage) {
            this.socketService.setSeen({
                message_id: lastMessage?._id,
                seen_at: moment().format('YYYY-MM-DD, hh:mm:ss'),
                ...formValue
            });
        }

    }

    getSeen() {
        this.subscriptions.push(this.socketService.getSeen().subscribe((dt: any) => {
            const {group_id, group_messages} = dt;
            this.groupsMessagesStore.changeGroupMessages(group_id, group_messages);
        }));
    }

    setTyping(formValue) {
        this.socketService.setTyping(formValue);
    }

    getTyping() {
        this.socketService.getTyping().subscribe((dt: any) => {
            this.getTypingTextStatus(dt);
        });
    }

    getTypingTextStatus(dt) {
        console.log(dt);
        const sameGroupTyping = dt.from_id !== this.authUser.id && dt.group_name === this.selectedGroupMessages.name && dt.message;
        this.typingText = {
            id: dt.from_id,
            group: sameGroupTyping ? this.selectedGroupMessages?.name === dt.group_name : null,
            text: sameGroupTyping ? `${dt.from_username} is typing...` : null
        };
        if (this.typingText.group && this.groupsTypingMessages.length === 0) {
            this.groupsTypingMessages.push(this.typingText);
        }
        if (this.typingText.group && this.groupsTypingMessages.length > 0 && this.arrFilter(this.groupsTypingMessages, this.typingText)) {
            this.groupsTypingMessages.push(this.typingText);
        }
        if (!this.typingText.group && !this.arrFilter(this.groupsTypingMessages, this.typingText)) {
            this.groupsTypingMessages = this.groupsTypingMessages.filter((el) => el.id !== this.typingText.id);
        }
        console.log(this.groupsTypingMessages);
    }
    arrFilter(arr, value) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === value.id) {
                return false;
            }
        }
        return true;
    }

    sendMessage(formValue) {
        this.socketService.sendMessage(formValue);
    }

    getMessagesFromSocket() {
        this.subscriptions.push(this.socketService.onNewMessage().subscribe((dt: any) => {
            this.resetTyping();
            this.sHelper.scrollMsgsToBottom(this.messagesList);
        }));
    }

    resetTyping() {
        this.typingText = {
            id: null,
            group: false,
            text: ''
        };
    }

    ngAfterViewChecked() {
        this.sHelper.scrollMsgsToBottom(this.messagesList);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
