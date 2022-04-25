import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';

@Component({
    selector: 'app-groups-list',
    templateUrl: './groups-list.component.html',
    styleUrls: ['./groups-list.component.scss'],
    providers: [{provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper}]

})
export class GroupsListComponent implements OnInit, OnDestroy {
    @Input() authUser;
    @Input() sidebarMode = false;
    @Output() closeRightSidenav = new EventEmitter();


    subscriptions: Subscription[] = [];

    selectedGroup;
    filteredGroupsMessages = [];

    constructor(
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private usersMessagesStore: UsersMessagesSubjectService,
        private dialog: MatDialog,
        private isEmptyObj: CheckForEmptyObjectPipe,
        public mobileHelper: MobileResponsiveHelper
    ) {
    }

    ngOnInit(): void {
        this.getGroupsMessages();
        this.getGroupFormValue();
        this.removeFromGroupNotify();
        this.removeGroupNotify();
    }

    getGroupsMessages() {
        this.groupsMessagesStore.groupsMessages$.subscribe(dt => {
            // console.log('groups changed', dt);
            this.filteredGroupsMessages = dt;
            const storeGroups = this.groupsMessagesStore.selectedGroupMessages;

            if (dt.length > 0) {
                this.selectedGroup = this.isEmptyObj.transform(storeGroups) ? dt[0] : storeGroups;
                this.groupsMessagesStore.selectGroup(this.selectedGroup);
            }
        });
    }

    getGroupFormValue() {
        this.subscriptions.push(this.groupsMessagesStore.addGroupFormValue.subscribe(dt => {
            this.addGroup(dt);
        }));
    }

    addGroup(formValue) {
        this.subscriptions.push(this.chatService.addGroup(formValue).subscribe(dt => {
            this.selectedGroup = dt.find(d => formValue.name === d.name);
            // console.log(dt)
            // console.log(this.selectedGroup)
            this.groupsMessagesStore.setGroupsMessages(dt);
            this.groupsMessagesStore.selectGroup(this.selectedGroup);
            this.socketService.setNewChatGroup(formValue);
        }));
    }

    removeGroupNotify() {
        this.subscriptions.push(this.socketService.removeGroupNotify().subscribe((data: any) => {
            console.log('removed group', data)
            if (data.initiator.id === this.authUser.id) {
                this.groupsMessagesStore.setGroupsMessages(data.groupsUsers);
            } else {
                this.refreshGroupsMessages();
            }
            this.groupsMessagesStore.selectGroup({});
        }));
    }

    removeFromGroupNotify() {
        this.subscriptions.push(this.socketService.removeFromChatGroupNotify().subscribe((data: any) => {
            const {group, member, leftGroups} = data;
            console.log('removed from group', member)
            if (member.id === this.authUser.id) {
                this.groupsMessagesStore.setGroupsMessages(leftGroups);
                this.groupsMessagesStore.selectGroup({});
            }
        }));
    }

    refreshGroupsMessages() {
        this.subscriptions.push(this.chatService.getGroupsMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.groupsMessagesStore.setGroupsMessages(dt);
        }));
    }


    makeGroupActive(group) {
        this.selectedGroup = group;
        this.groupsMessagesStore.selectGroup(group);
        if (this.sidebarMode) {
            this.usersMessagesStore.showBottomChatBox = false;
            this.groupsMessagesStore.showBottomChatBox = true;
        } else {
            this.groupsMessagesStore.showResponsiveChatBox = true;
        }
        if (this.mobileHelper.isChatUsersListSize()) {
            this.closeRightSidenav.emit();
        }
    }

    ifConfirmedToJoinTheGroup(group) {
        return group?.chat_group_members.find(member => member.id === this.authUser.id && member.chat_groups_members.accepted);
    }

    isSeenByAuthUser(messages) {
        return messages?.filter(message => {
            let found = false;
            if (message.from_id !== this.authUser.id) {
                found = !message.seen.find(sb => sb.seen_by.id === this.authUser.id);
            }
            return found;
        }).length;
    }

    leaveGroup() {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.leaveGroup({
                    member_id: this.authUser.id,
                    group_id: this.selectedGroup.id,
                }).subscribe(dt => {
                    this.groupsMessagesStore.setGroupsMessages(dt);
                    this.socketService.leaveChatGroup({
                        group: this.selectedGroup,
                        from_user: this.authUser,
                        group_type: 'chat',
                        msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has left the <strong>${this.selectedGroup.name}</strong> group`
                    });
                    this.selectedGroup = null;
                });
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
