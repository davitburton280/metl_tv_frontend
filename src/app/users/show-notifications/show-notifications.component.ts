import {Component, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-show-notifications',
    templateUrl: './show-notifications.component.html',
    styleUrls: ['./show-notifications.component.scss']
})
export class ShowNotificationsComponent implements OnInit {
    authUser: CurrentUserData;

    constructor(
        private _userInfoService: UserInfoService,
        private userStore: UserStoreService) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
        // this.userStore.authUser$.subscribe(user => {
        //     this.authUser = user;
        // });
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Show Notifications  AUTHUSER DATA');
        });
    }

}
