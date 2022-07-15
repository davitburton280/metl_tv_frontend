import {Component, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-show-chat-group-members',
    templateUrl: './show-chat-group-members.component.html',
    styleUrls: ['./show-chat-group-members.component.scss']
})
export class ShowChatGroupMembersComponent implements OnInit {
    selectedGroup;
    authUser: CurrentUserData;

    activeTab = 'All members';

    constructor(
        private groupsMessagesStore: GroupsMessagesSubjectService,
        // private getAuthUser: GetAuthUserPipe
        private _userInfoService: UserInfoService
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
        // this.authUser = this.getAuthUser.transform();
        this.getGroupMembers();
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Show Chat Group members  AUTHUSER DATA');
        });
    }

    getGroupMembers() {
        this.selectedGroup = this.groupsMessagesStore.selectedGroupMessages;
    }

    getOnlyJoinedMembers() {
        return this.selectedGroup.chat_group_members.filter(m => m.chat_groups_members.confirmed);
    }

    changeActiveTab(tab) {
        this.activeTab = tab;
    }

}
