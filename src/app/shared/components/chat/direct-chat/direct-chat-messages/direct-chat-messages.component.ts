import {AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {Subscription} from 'rxjs';
import {SocketIoService} from '@core/services/socket-io.service';
import {ChatService} from '@core/services/chat.service';
import {SubjectService} from '@core/services/subject.service';
import {SharedChatHelper} from '@core/helpers/shared-chat-helper';

@Component({
    selector: 'app-direct-chat-messages',
    templateUrl: './direct-chat-messages.component.html',
    styleUrls: ['./direct-chat-messages.component.scss'],
    providers: [{provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper}]
})
export class DirectChatMessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
    @Input() authUser;
    @Input() embedMode = false;
    @ViewChild('directMessagesList') private messagesList: ElementRef;

    subscriptions: Subscription[] = [];

    selectedUserMessages;

    typingText = null;
    userTypingText = {
        id: null,
        from_id: null,
        to_id: null,
        text: this.typingText
    };
    isBlockedUser = false;
    groupsTypingMessages = [];

    constructor(
        private usersMessagesStore: UsersMessagesSubjectService,
        private subject: SubjectService,
        private socketService: SocketIoService,
        private chatService: ChatService,
        public mobileHelper: MobileResponsiveHelper,
        public sHelper: SharedChatHelper
    ) {
    }

    ngOnInit(): void {
        this.trackUsersMessagesChange();
        this.getSeen();
        this.getTyping();
        this.getMessagesFromSocket();
    }

    trackUsersMessagesChange() {
        this.subscriptions.push(this.usersMessagesStore.selectedUserMessages$.subscribe((dt: any) => {
            this.selectedUserMessages = dt;
            if (dt && dt.length > 0) {
                this.isBlockedUser = !!dt.users_connections[0].is_blocked;
                this.typingText = null;
            }
        }));
    }

    setSeen(formValue) {
        const {owned, lastMessage} = this.sHelper.isLastMsgOwn(this.selectedUserMessages.direct_messages);
        if (!owned) {
            this.socketService.setSeen({
                message_id: lastMessage?._id,
                seen: 1,
                ...formValue
            });
        }
    }

    getSeen() {
        this.subscriptions.push(this.socketService.getSeen().subscribe((dt: any) => {
            const {from_id, to_id, direct_messages} = dt;

            if (this.selectedUserMessages.id === to_id) {
                this.usersMessagesStore.changeOneUserMessages(to_id, direct_messages);
            } else if (this.selectedUserMessages.id === from_id) {
                this.usersMessagesStore.changeOneUserMessages(from_id, direct_messages);
            }

        }));
    }

    setTyping(formValue) {
        this.socketService.setTyping(formValue);
    }

    getTyping() {
        this.subscriptions.push(this.socketService.getTyping().subscribe((dt: any) => {
            console.log(dt);
            console.log(dt.from_id);
            console.log(this.selectedUserMessages.id);
            console.log(this.authUser.id);
            this.typingText = dt.message ? `${dt.from_first_name} is typing...` : null;
            if (dt.from_id !== this.authUser.id && this.selectedUserMessages.id === dt.from_id && this.typingText && this.arrFilter(this.groupsTypingMessages, this.authUser.id)) {
                this.userTypingText = {
                    id: this.authUser.id,
                    from_id: dt.from_id,
                    to_id: dt.to_id,
                    text: this.typingText
                };
                this.groupsTypingMessages.push(this.userTypingText);
                console.log('-----------------');
            }
            if (this.groupsTypingMessages.length > 0) {
                console.log('typing from id', this.userTypingText.from_id);
                console.log('select id', this.selectedUserMessages.id);
                this.groupsTypingMessages = this.groupsTypingMessages.filter(() => this.selectedUserMessages.id !== this.userTypingText.id && this.typingText);
            }
            console.log(this.typingText);
            console.log(this.groupsTypingMessages);
        }));
    }
    //     this.subscriptions.push(this.socketService.getTyping().subscribe((dt: any) => {
    //     console.log(dt);
    //     const sameGroupTyping = dt.from_id !== this.authUser.id && dt.group_name === this.selectedUserMessages.name && dt.message;
    //     this.typingText = sameGroupTyping ? `${dt.from_username} is typing...` : null;
    //     this.userTypingText = {
    //         id: dt.from_id,
    //         text: this.typingText
    //     };
    //     console.log(sameGroupTyping);
    //     if (this.userTypingText.text && this.groupsTypingMessages.length === 0) {
    //         this.groupsTypingMessages.push(this.userTypingText);
    //     }
    //     if (this.userTypingText.text && this.groupsTypingMessages.length > 0 && this.arrFilter(this.groupsTypingMessages, this.userTypingText)) {
    //         this.groupsTypingMessages.push(this.userTypingText);
    //     }
    //     if (!this.userTypingText.text && !this.arrFilter(this.groupsTypingMessages, this.userTypingText)) {
    //         this.groupsTypingMessages = this.groupsTypingMessages.filter((el) => el.id !== this.userTypingText.id);
    //     }
    //     console.log(this.groupsTypingMessages);
    //     }));
    // }

    arrFilter(arr, value) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === value) {
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
            this.typingText = null;
            this.sHelper.scrollMsgsToBottom(this.messagesList);
        }));
    }

    isContactBlocked(user) {
        return user?.users_connections?.[0]?.is_blocked;
    }

    isSeenByOtherUser(msg) {
        return msg.seen && msg.to_id !== this.authUser.id;
    }

    backToUsers() {
        this.selectedUserMessages = null;
        this.usersMessagesStore.changeUser([]);
        console.log(this.usersMessagesStore.selectedUserMessages)
        this.usersMessagesStore.showResponsiveChatBox = false;
    }

    identifyMessage(index, item) {
        return item._id;
    }

    ngAfterViewChecked() {
        if (!this.isBlockedUser) {
            this.sHelper.scrollMsgsToBottom(this.messagesList);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
