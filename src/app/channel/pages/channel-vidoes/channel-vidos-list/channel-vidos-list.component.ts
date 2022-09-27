import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChannelVidosDataListInterface } from '@core/interfaces/channel-vidos.interface';

@Component({
    selector: 'app-channel-videos-list',
    templateUrl: 'channel-vidos-list.component.html',
    styleUrls: ['channel-vidos-list.component.scss']
})

export class ChannelVidosListComponent implements OnInit, OnDestroy {
    @Input() videosList: ChannelVidosDataListInterface[] | undefined;
    constructor() {

    }

    ngOnInit() {
        console.log(this.videosList, 'videosList');
    }



    ngOnDestroy() {
    }
}
