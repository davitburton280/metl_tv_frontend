import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsService} from '@core/services/groups.service';
import {Subscription} from 'rxjs';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {NotificationsSubjectStoreService} from '@core/services/stores/notifications-subject-store.service';

@Component({
    selector: 'app-group-members-list',
    templateUrl: './group-members-list.component.html',
    styleUrls: ['./group-members-list.component.scss']
})
export class GroupMembersListComponent implements OnInit, OnDestroy {

    @Input() authUser;
    @Input() selectedGroup;
    @Input() members;
    @Input() isOwnGroup;

    subscriptions: Subscription[] = [];

    constructor(
        private socketService: SocketIoService,
        private groupsService: GroupsService,
        private groupsStore: GroupsStoreService,
        private notificationsStore: NotificationsSubjectStoreService
    ) {
    }

    ngOnInit(): void {
        this.getAcceptedPageGroupAdminRequest();
        this.getDeclinedPageGroupAdminRequest();
    }


    getAcceptedPageGroupAdminRequest() {
        this.subscriptions.push(this.socketService.getAcceptedPageGroupAdminRequest().subscribe((data: any) => {
            const {notification, ...rest} = data;
            if (notification.from_user.id !== this.authUser.id) {
                this.notificationsStore.updateNotifications(notification);
            }
            this.groupsStore.changeGroup(rest.group);
            // console.log(this.groupsStore.groups);
        }));
    }

    getDeclinedPageGroupAdminRequest() {
        this.subscriptions.push(this.socketService.getDeclinedPageGroupAdminRequest().subscribe((data: any) => {
            const {notification, ...rest} = data;
            // this.adminRequestSent = false;
            if (notification.from_user.id !== this.authUser.id) {
                this.notificationsStore.updateNotifications(notification);
            }
            this.groupsStore.changeGroup(rest.group);
            console.log(this.groupsStore.groups);
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
