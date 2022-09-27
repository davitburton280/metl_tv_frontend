import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserInfoService } from '@core/services/user-info.service';
import { ChannelsService } from '@core/services/channels.service';
import { ActivatedRoute, Params } from '@angular/router';
import { SubscribersItem, SubscriptionResponseInterface } from '@core/interfaces/subscription.interface';

@Component({
    selector: 'app-sub-page',
    templateUrl: 'sub-page.component.html',
    styleUrls: ['sub-page.component.scss']
})

export class SubPageComponent implements OnInit, OnDestroy {
    private _groupId: number | undefined;
    public subscribers: SubscribersItem [] | undefined;

    constructor(
        private _channelsService: ChannelsService,
        private _route: ActivatedRoute,
        private _userInfoService: UserInfoService
    ) {
        this._route.params.subscribe((params: Params) => {
            this._groupId = params.id;
        });
    }


    ngOnInit() {
        this._channelsService.getChannelSubscription({ id: this._groupId })
            .subscribe((data: SubscriptionResponseInterface) => {
                this.subscribers = data.subscribers;
            });
    }


    ngOnDestroy() {
    }
}
