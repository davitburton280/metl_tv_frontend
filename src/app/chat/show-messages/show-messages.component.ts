import {Component, OnInit} from '@angular/core';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';

import {DatePipe} from '@angular/common';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';


@Component({
    selector: 'app-show-messages',
    templateUrl: './show-messages.component.html',
    styleUrls: ['./show-messages.component.scss'],
    providers: [{provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper}]
})
export class ShowMessagesComponent implements OnInit {
    activeTab = 'direct';
    authUser: CurrentUserData;

    groupsMessages = [];
    groupsLoaded = false;
    subscriptions: Subscription[] = [];
    newMessagesCountInGroups = 0;
    newMessagesCountInDirect = 0;

    constructor(
        private chatService: ChatService,
        // private getAuthUser: GetAuthUserPipe,
        private _userInfoService: UserInfoService,
        private socketService: SocketIoService,
        public usersMessagesStore: UsersMessagesSubjectService,
        public groupsMessagesStore: GroupsMessagesSubjectService,
        private subject: SubjectService,
        private datePipe: DatePipe,
        private groupBy: GroupByPipe,
        public mobileHelper: MobileResponsiveHelper,
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
        // this.authUser = this.getAuthUser.transform();
        // this.getGroupsMessages();
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Show Messages  AUTHUSER DATA');
        });
    }


    changeTab(tab) {
        this.activeTab = tab;
    }

    getGroupsMessages() {
        this.subscriptions.push(this.chatService.getGroupsMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.groupsMessages = dt;
            this.groupsLoaded = true;
            const newMessagesSource = dt.filter(fm => fm.new_messages_count > 0);
            // console.log(newMessagesSource)
            this.newMessagesCountInGroups = newMessagesSource.length;
            this.subject.setNewMessagesSourceData({source: newMessagesSource, type: 'group'});
        }));
    }

    isRightWrapHidden() {
        if (this.mobileHelper.isChatUsersListSize()) {
            return !this.usersMessagesStore.showResponsiveChatBox
                && !this.groupsMessagesStore.showResponsiveChatBox;
        }
        return false;
    }


}
