import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChannelsService} from '@core/services/channels.service';
import {ActivatedRoute, Params} from '@angular/router';
import {take} from 'rxjs/operators';

@Component({
    selector: 'app-channel-videos',
    templateUrl: 'channel-videos.component.html',
    styleUrls: ['channel-videos.component.scss']
})

export class ChannelVideosComponent implements OnInit, OnDestroy {
    private _groupId: number | undefined;

    constructor(
        private _channelsService: ChannelsService,
        private _route: ActivatedRoute
    ) {
        this._route.params.subscribe((params: Params) => {
            this._groupId = params.id;
        });
    }

    ngOnInit() {
        this._channelsService.getChannelVideosByChannelId(this._groupId)
            .pipe(take(1))
            .subscribe((data: any) => {
                console.log(data);
            });
    }

    ngOnDestroy() {
    }
}
