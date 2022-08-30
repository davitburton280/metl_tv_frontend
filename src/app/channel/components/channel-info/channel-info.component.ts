import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChanelInterface} from '@core/interfaces';

@Component({
    selector: 'app-channel-info',
    templateUrl: 'channel-info.component.html',
    styleUrls: ['channel-info.component.scss']
})

export class ChannelInfoComponent implements OnInit, OnDestroy {
    @Input() channelData: ChanelInterface;
    public coverImgSrc: string | undefined;
    public avatarImgSrc: string | undefined;

    constructor() {
        console.log(this.channelData, 'GO GO GO');
    }

    ngOnInit() {
    }


    ngOnDestroy() {
    }
}
