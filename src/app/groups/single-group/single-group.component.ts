import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Subscription} from 'rxjs';
import {User} from '@shared/models/user';
import {GROUP_PAGE_TABS} from '@core/constants/global';
import {MatDialog} from '@angular/material/dialog';
import {LowercaseRemoveSpacesPipe} from '@shared/pipes/lowercase-remove-spaces.pipe';
import {GroupMembersInvitationDialogComponent} from '@core/components/modals/group-members-invitation-dialog/group-members-invitation-dialog.component';
import {GroupsService} from '@core/services/groups.service';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-single-group',
    templateUrl: './single-group.component.html',
    styleUrls: ['./single-group.component.scss']
})
export class SingleGroupComponent implements OnInit, OnDestroy {
    authUser: CurrentUserData;
    subscriptions: Subscription[] = [];


    selectedGroup;
    isOwnGroup = false;
    passedGroupName: string;
    groupTabs = GROUP_PAGE_TABS;
    groupPrivacy = 'public';

    userGroupConnStatus = 'not connected';

    constructor(
        private groupsStore: GroupsStoreService,
        private groupsService: GroupsService,
        private route: ActivatedRoute,
        // private userStore: UserStoreService,
        private dialog: MatDialog,
        private lowerCaseRemoveSpaces: LowercaseRemoveSpacesPipe,
        private isEmptyObj: CheckForEmptyObjectPipe,
        private socketService: SocketIoService,
        private _userInfoService: UserInfoService
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
        this.trackSelectedGroup();
        // this.getAuthUser();
        this.getSelectedGroup();
        this.getAcceptedJoinPageGroup();
        this.getConfirmedJoinGroup();
        this.getIgnoredJoinGroup();
        this.getJoinGroup();
        this.getRemovedSavedMember();
        this.getLeftGroup();
    }

    // getAuthUser() {
    //     this.subscriptions.push(this.userStore.authUser$.subscribe(user => {
    //         this.authUser = user;
    //     }));
    // }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Single group AUTHUSER DATA');
        });
    }

    trackSelectedGroup() {
        this.subscriptions.push(this.groupsStore.selectedGroup$.subscribe((dt: any) => {
            console.log(dt,"Group INfo");
            this.selectedGroup = dt;
            this.groupPrivacy = dt.privacy === 1 ? 'private' : 'public';
            // console.log(this.selectedGroup, this.groupPrivacy);
            if (!this.isEmptyObj.transform(dt) && this.authUser) {
                this.getUserGroupConnStatus();
            }
        }));
    }

    getSelectedGroup() {
        this.route.params.subscribe((params: Params) => {
            this.passedGroupName = params.name;

            if (!this.getGroupFromStore()) {
                this.getGroupFromServer();
            }
        });
    }

    getGroupFromStore() {
        this.selectedGroup = this.groupsStore.groups.find(g => {
            const groupName = this.lowerCaseRemoveSpaces.transform(g.name);
            return groupName === this.passedGroupName;
        });
        if (this.selectedGroup) {
            this.isOwnGroup = this.selectedGroup.creator_id === this.authUser.id;
            this.groupsStore.selectGroup(this.selectedGroup);
        }
        return !!this.selectedGroup;
    }

    getGroupFromServer() {
        this.groupsService.getGroupByCustomName({custom_name: this.passedGroupName}).subscribe(dt => {
            this.selectedGroup = dt;
            this.isOwnGroup = this.selectedGroup.creator_id === this.authUser.id;
            this.groupsStore.selectGroup(this.selectedGroup);
        });
    }

    joinGroup() {
        console.log(this.selectedGroup);
        this.groupsService.joinGroup({
            member_ids: [this.authUser.id],
            group_id: this.selectedGroup.id,
            accepted: 1
        }).subscribe(dt => {
            this.userGroupConnStatus = 'unconfirmed';

            this.socketService.joinGroup({
                group: this.selectedGroup,
                from_user: this.authUser,
                msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> wants to to join the <strong>${this.selectedGroup.name}</strong> group`,
                link: `/channels/show?username=${this.authUser.username}`,
            });

            this.groupsStore.changeGroup(dt);
        });
    }

    getJoinGroup() {
        this.subscriptions.push(this.socketService.getJoinGroup().subscribe((data: any) => {
            const {rest} = data;
            console.log('get joined', rest.group);
            this.groupsStore.changeGroup(rest.group);
        }));
    }

    leaveGroup() {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.groupsService.leaveGroup({
                    member_id: this.authUser.id,
                    group_id: this.selectedGroup.id,
                }).subscribe(dt => {
                    this.groupsStore.setGroups(dt);
                    this.socketService.leavePageGroup({
                        group: this.selectedGroup,
                        from_user: this.authUser,
                        group_type: 'page',
                        msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has left the <strong>${this.selectedGroup.name}</strong> group`
                    });
                });
            }
        }));
    }

    getLeftGroup() {
        this.subscriptions.push(this.socketService.leavePageGroupNotify().subscribe((data: any) => {
            const {group} = data;

            if (data.from_user.id === this.authUser.id) {
                this.userGroupConnStatus = 'not connected';
                // console.log(this.selectedGroup);
                // this.groupsStore.selectGroup({});
            }
            this.groupsStore.changeGroup(group);
        }));
    }

    getConfirmedMembersCount() {
        return this.selectedGroup?.group_members?.filter(m => !!m.groups_members.confirmed).length || 0;
    }

    getAcceptedJoinPageGroup() {
        this.subscriptions.push(this.socketService.getAcceptedJoinPageGroup().subscribe((data: any) => {
            const {rest} = data;
            console.log('accepted', rest.group);
            // this.groupsStore.changeGroup(rest.group);
        }));
    }

    getConfirmedJoinGroup() {
        this.subscriptions.push(this.socketService.getConfirmedJoinGroup().subscribe((data: any) => {
            const {rest} = data;
            console.log('confirmed in group page', data);
            this.userGroupConnStatus = 'confirmed';
            this.groupsStore.changeGroup(rest.group);
        }));
    }

    getIgnoredJoinGroup() {
        this.subscriptions.push(this.socketService.getIgnoredJoinGroup().subscribe((data: any) => {
            const {rest} = data;
            console.log('ignored in group page', rest);
            if (rest.member.id === this.authUser.id) {
                this.groupsStore.setGroups(rest.leftGroups);
                this.groupsStore.selectGroup(rest.group);
                this.userGroupConnStatus = 'not connected';
            }
            console.log(this.groupsStore.groups);
        }));
    }

    getRemovedSavedMember() {
        this.subscriptions.push(this.socketService.removeFromPageGroupNotify().subscribe((data: any) => {
            const {member, leftGroups} = data;
            console.log('removed from group in group page', data);
            this.groupsStore.changeGroup(data.group);
            if (member.id === this.authUser.id) {
                this.userGroupConnStatus = 'not connected';
            }
            // console.log(this.groupsMessagesStore.selectedGroupMessages)
            // console.log(this.groupsMessagesStore.groupsMessages)
            // }
        }));
    }

    getUserGroupConnStatus() {
        this.selectedGroup.group_members?.map(m => {
            if (m.id === this.authUser.id) {
                if (m.groups_members.confirmed === 1) {
                    this.userGroupConnStatus = 'confirmed';
                } else {
                    if (m.groups_members.accepted === 1) {
                        this.userGroupConnStatus = 'unconfirmed';
                    } else {
                        this.userGroupConnStatus = 'not connected';
                    }
                }
            }
        });
    }

    showJoinBtn() {
        return !this.isOwnGroup;
    }

    onOutletLoaded(component) {
        if (this.selectedGroup) {
            component.selectedGroup = this.selectedGroup;
            component.isOwnGroup = this.isOwnGroup;
            component.authUser = this.authUser;
        }
    }

    openMembersModal() {
        this.subscriptions.push(this.dialog.open(GroupMembersInvitationDialogComponent, {
            height: '690px',
            width: '950px',
            data: this.authUser,
        }).afterClosed().subscribe(dt => {

        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
