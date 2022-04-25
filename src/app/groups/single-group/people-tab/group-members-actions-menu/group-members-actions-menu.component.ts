import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsService} from '@core/services/groups.service';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {NotificationsSubjectStoreService} from '@core/services/stores/notifications-subject-store.service';
import {Subscription} from 'rxjs';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-group-members-actions-menu',
    templateUrl: './group-members-actions-menu.component.html',
    styleUrls: ['./group-members-actions-menu.component.scss']
})
export class GroupMembersActionsMenuComponent implements OnInit, OnDestroy {
    @Input() member;
    @Input() authUser;
    @Input() selectedGroup;
    @Input() isOwnGroup;

    subscriptions: Subscription[] = [];
    adminRequestSent = false;
    moderatorRequestSent = false;

    constructor(
        private socketService: SocketIoService,
        private groupsService: GroupsService,
        private groupsStore: GroupsStoreService,
        private notificationsStore: NotificationsSubjectStoreService,
        private dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {

    }

    makeAdmin(member, type = 'admin') {
        console.log('make admin', member)
        this.socketService.sendMakeAdminRequest({
            from_user: this.authUser,
            group: this.selectedGroup,
            member,
            type,
            msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong>
                invites you to become ${type === 'admin' ? 'an admin' : 'a moderator'}
                 for the <strong>${this.selectedGroup.name}</strong> group`
        });

        this.adminRequestSent = type === 'admin';
        this.moderatorRequestSent = type === 'moderator';
    }

    removeMember(member) {
        console.log('remove')
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.groupsService.removeGroupMember({
                    group_id: this.selectedGroup.id,
                    member_id: member.id
                }).subscribe(dt => {
                    this.selectedGroup = dt;
                    this.groupsStore.changeGroup(this.selectedGroup);
                    this.socketService.removeFromPageGroup({
                        member,
                        from_user: this.authUser,
                        group: this.selectedGroup,
                        msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> removed  <strong>${member.first_name + ' ' + member.last_name}</strong>
                       from <strong>${this.selectedGroup.name}</strong> group`,
                    });
                });
            }
        }));
    }

    removeAdminPrivileges(member, type = 'admin') {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.subscriptions.push(this.groupsService.removeAdminPrivileges({
                    member_id: member.id,
                    group_id: this.selectedGroup.id
                }).subscribe(dt => {
                    this.socketService.removePageGroupAdminPrivileges({
                        member,
                        from_user: this.authUser,
                        group: this.selectedGroup,
                        msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> removed ${type}  privileges of <strong>${member.first_name + ' ' + member.last_name}</strong>
                       for the <strong>${this.selectedGroup.name}</strong> group`,
                    });
                    this.groupsStore.changeGroup(dt);
                }));
            }
        }));
    }

    makeModerator(member) {

    }

    isAdmin(member) {
        return member.groups_members.is_admin;
    }

    isModerator(member) {
        return member.groups_members.is_moderator;
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
