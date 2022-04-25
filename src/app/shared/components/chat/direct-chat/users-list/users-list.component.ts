import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SocketIoService} from '@core/services/socket-io.service';
import {UsersService} from '@core/services/users.service';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {Subscription} from 'rxjs';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {User} from '@shared/models/user';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss'],
    providers: [{provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper}]
})
export class UsersListComponent implements OnInit, OnDestroy {
    @Input() authUser;
    @Input() sidebarMode = false;
    @Output() closeRightSidenav = new EventEmitter();

    subscriptions: Subscription[] = [];
    filteredUsersMessages = [];
    selectedUserMessages;


    blockedUsers = [];
    onlineUsers = [];
    showBlockedUsers = false;

    constructor(
        private socketService: SocketIoService,
        private usersService: UsersService,
        private usersMessagesStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        public mobileHelper: MobileResponsiveHelper,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        if (this.authUser) {
            this.getUsersMessages();
            this.getOnlineUsers();
            this.getSeen();
            this.onLogout();
        }
    }

    getUsersMessages() {

        this.usersMessagesStore.usersMessages$.subscribe(dt => {
            // console.log('users list!!!', dt)
            this.cdr.markForCheck();
            this.filteredUsersMessages = dt.filter(d => {
                const connection = d.users_connections[0];
                return !!connection.is_blocked === this.showBlockedUsers && !!connection.confirmed;
            });
            // console.log(this.filteredUsersMessages)
            this.selectedUserMessages = this.filteredUsersMessages[0];
            this.usersMessagesStore.changeUser(this.selectedUserMessages);

            if (this.mobileHelper.isChatUsersListSize()) {

                this.cdr.detectChanges();
                this.usersMessagesStore.showResponsiveChatBox = true;
            }
        });
    }

    selectUserMessages(userMessages, lastMsg) {
        if (this.sidebarMode) {
            this.usersMessagesStore.showBottomChatBox = true;
            this.groupsMessagesStore.showBottomChatBox = false;
        } else {
            this.usersMessagesStore.showResponsiveChatBox = true;
        }
        this.selectedUserMessages = userMessages;
        this.usersMessagesStore.changeUser(userMessages);
        if (this.mobileHelper.isChatUsersListSize()) {
            this.closeRightSidenav.emit();
        }
    }

    toggleBlockedUsers(show) {
        this.showBlockedUsers = show;
        this.filteredUsersMessages = this.usersMessagesStore.usersMessages.filter(d => {
            const connection = d.users_connections[0];
            return !!connection.is_blocked === show && !!connection.confirmed;
        });
        this.selectedUserMessages = this.filteredUsersMessages[0];
        this.usersMessagesStore.changeUser(this.selectedUserMessages);
    }

    unreadLastMessages(usersMessages) {
        const messages = usersMessages.direct_messages;
        const lastReceivedMessages = [];

        messages.reverse().some((message) => {
            if (message.from_id !== this.authUser.id) {
                lastReceivedMessages.push(message);
            }
            return message.from_id === this.authUser.id;
        });
        messages.reverse();

        const params = {
            connection_id: usersMessages.users_connections?.[0].id,
            message_ids: lastReceivedMessages.map(m => m._id),
            to_username: usersMessages.username,
            from_username: this.authUser.username,
            from_id: this.authUser.id,
            to_id: usersMessages.id
        };

        if (params.message_ids.length > 0) {
            this.socketService.unreadLastMessages(params);
        }
    }

    getOnlineUsers() {
        this.socketService.getConnectedUsers({username: this.authUser.username});

        this.subscriptions.push(this.socketService.userOnlineFeedback().subscribe((dt: any) => {
            // console.log('online users', dt)
            this.onlineUsers = dt;
        }));
    }

    blockUser(user) {
        const params = {
            connection_id: user.users_connections?.[0].id,
            user: this.authUser,
            block: +!this.showBlockedUsers,
            contact_username: user.username
        };

        this.subscriptions.push(this.usersService.blockUser(params).subscribe(dt => {
            this.socketService.blockUnblockUser({
                connection_id: user.users_connections?.[0].id,
                block: +!this.showBlockedUsers,
                from_user: this.authUser,
                to_user: user,
                msg: `<strong>${this.authUser.first_name} ${this.authUser.last_name}</strong> has blocked the connection between you two`,
            });
        }));
    }

    getSeen() {
        this.subscriptions.push(this.socketService.getSeen().subscribe((dt: any) => {
            const {from_id, to_id, direct_messages} = dt;
            // console.log('get seen from users list', this.selectedUserMessages.id, to_id)
            // console.log(dt)
            if (this.selectedUserMessages.id === to_id) {
                this.usersMessagesStore.changeOneUserMessages(to_id, direct_messages);
            } else {
                this.usersMessagesStore.changeOneUserMessages(from_id, direct_messages);
            }
        }));
    }

    onLogout() {
        this.socketService.onLogout().subscribe((user: User) => {
            this.onlineUsers = this.onlineUsers.filter(u => u !== user.username);
            // console.log('logout', this.onlineUsers)
        });
    }

    getUserLastMessage(messages) {
        return messages ? messages[messages.length - 1] : {};
    }

    getUserCurrentStatus(username) {
        return this.onlineUsers.length === 0 || this.onlineUsers.includes(username);
    }

    ifContactsListActionsShown() {
        return this.usersMessagesStore.usersMessages.length > 0;
    }

    ifContactBlocked(user) {
        return user.users_connections?.[0].is_blocked;
    }

    ifUnreadShown(lastMsg, user) {
        return lastMsg?.from_id !== this.authUser.id && !user.users_connections[0].is_blocked;
    }

    ifMoreActionsShown(lastMsg, user) {
        return !user.users_connections[0].is_blocked && (!lastMsg || lastMsg?.from_id === this.authUser.id || lastMsg?.seen);
    }

    ifLastMessageUnseen(lastMsg) {
        return !lastMsg?.seen && lastMsg?.from_id !== this.authUser.id;
    }

    getUnseenMessagesCount(userMessages) {
        return userMessages.direct_messages?.filter(um => !um.seen).length;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
