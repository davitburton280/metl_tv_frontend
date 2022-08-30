import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChanelInterface, CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-main-channel-page',
    templateUrl: 'main-channel-page.component.html',
    styleUrls: ['main-channel-page.component.scss']
})

export class MainChannelPageComponent implements OnInit, OnDestroy {
    public channelData: ChanelInterface;

    constructor(private _userInfoService: UserInfoService) {
        this._currentUserData();
    }


    ngOnInit() {

    }

    private _currentUserData() {
        this._userInfoService._userInfo
            .subscribe((data: CurrentUserData) => {
                this.channelData = data?.channel;
            });
    }


    ngOnDestroy() {
    }
}
