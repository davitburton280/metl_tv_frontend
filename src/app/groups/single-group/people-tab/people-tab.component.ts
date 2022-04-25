import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {GroupsService} from '@core/services/groups.service';
import {Subscription} from 'rxjs';
import {SocketIoService} from '@core/services/socket-io.service';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@core/services/chat.service';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {NotificationsSubjectStoreService} from '@core/services/stores/notifications-subject-store.service';

@Component({
    selector: 'app-people-tab',
    templateUrl: './people-tab.component.html',
    styleUrls: ['./people-tab.component.scss']
})
export class PeopleTabComponent implements OnInit, OnDestroy {
    @Input() selectedGroup;
    @Input() isOwnGroup;
    @Input() authUser;

    admins = [];
    members = [];
    requestedMembers = [];

    subscriptions: Subscription[] = [];


    constructor(
        private groupsService: GroupsService,
        private groupsStore: GroupsStoreService,
        private notificationsStore: NotificationsSubjectStoreService,
        private socketService: SocketIoService,
        private chatService: ChatService,
        private isEmptyObj: CheckForEmptyObjectPipe,
    ) {
    }

    ngOnInit(): void {
        this.trackGroups();
        this.getAcceptedJoinPageGroup();
        this.getRemovedPageGroupAdminPrivileges();
    }

    trackGroups() {
        this.subscriptions.push(this.groupsStore.selectedGroup$.subscribe(dt => {
            console.log(dt);
            this.selectedGroup = dt;
            this.admins = [];
            this.members = [];
            this.requestedMembers = [];

            if (!this.isEmptyObj.transform(this.selectedGroup)) {
                this.filterMembers();
            }
        }));
    }


    filterMembers() {
        this.selectedGroup?.group_members?.map(m => {
            if (this.selectedGroup.creator_id === m.id || m.groups_members.is_admin || m.groups_members.is_moderator) {
                this.admins.push(m);
            } else {
                if (m.groups_members.confirmed) {
                    this.members.push(m);
                } else if (m.groups_members.accepted) {
                    this.requestedMembers.push(m);
                }
            }
        });
    }

    getAcceptedJoinPageGroup() {
        this.subscriptions.push(this.socketService.getAcceptedJoinPageGroup().subscribe((data: any) => {
            const {rest} = data;
            console.log('accepted', rest.group);
            // this.groupsStore.changeGroup(rest.group);
        }));
    }

    getRemovedPageGroupAdminPrivileges() {
        this.subscriptions.push(this.socketService.getRemovedPageGroupAdminPrivileges().subscribe((data: any) => {
            const {notification, member, group} = data;
            this.notificationsStore.updateNotifications(notification);
            console.log('removed privileges', group);
            this.groupsStore.changeGroup(group);
        }));
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
