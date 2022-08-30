import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChanelInterface, CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';
import {ChannelsService} from '@core/services/channels.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-invite-channel',
    templateUrl: './invite-channel.component.html',
    styleUrls: ['invite-channel.component.scss']
})

export class InviteChannelComponent implements OnInit, OnDestroy {
    private usersConnection: any;
    private _unsubscribe$ = new Subject<void>();
    private authUser: CurrentUserData;
    private _usersInviteData = [];
    public channelSubscriptionMembers: ChanelInterface[];


    constructor(
        private _channelsService: ChannelsService,
        private _userInfoService: UserInfoService
    ) {
        this._getAuthInfo();

    }

    ngOnInit() {
        this.getSubscriptionUser();
    }

    private getSubscriptionUser() {
        this._channelsService.getUserChannelSubscriptions({user_id: this.authUser.id})
            .pipe(
                takeUntil(this._unsubscribe$),
            )
            .subscribe((data: any) => {
                this.usersConnection = data;
                console.log(this.usersConnection);
            });
    }

    private _getAuthInfo(): void {
        this._userInfoService._userInfo
            .pipe(
                takeUntil(this._unsubscribe$),
            )
            .subscribe((data) => {
                this.authUser = data;
            });
    }

    public inviteUserInGroup(userData: any): void {
        if (this._usersInviteData === [] || !this._usersInviteData.includes(userData)) {
            this._usersInviteData.push(userData);
            console.log('Concat Data ', this._usersInviteData);
        } else {
            console.log('Concat Data ', this._usersInviteData);
        }
    }

    ngOnDestroy() {
    }
}
