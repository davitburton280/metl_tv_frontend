import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelsService } from '@core/services/channels.service';
import { ActivatedRoute, Params } from '@angular/router';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChannelVideosInitialStateInterface } from '@core/interfaces/channel-vidos.interface';

@Component({
    selector: 'app-channel-videos',
    templateUrl: 'channel-videos.component.html',
    styleUrls: ['channel-videos.component.scss']
})

export class ChannelVideosComponent implements OnInit, OnDestroy {
    private _groupId: number | undefined;
    public channelVideosStateData$: Observable<ChannelVideosInitialStateInterface> | undefined;

    constructor(
        private _channelsService: ChannelsService,
        private _route: ActivatedRoute
    ) {
        this._getParamsInRout();
        this.channelVideosStateData$ = this._channelsService.channelVideoState$.state$;
    }

    ngOnInit() {
        this._getVideos();
    }

    private _getVideos() {
        this._channelsService.getChannelVideosByChannelId({ id: this._groupId });
    }

    private _getParamsInRout() {
        this._route.params.subscribe((params: Params) => {
            this._groupId = params.id;
        });
    }

    ngOnDestroy() {
    }
}
