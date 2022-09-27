import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelsService } from '@core/services/channels.service';
import { ChannelCategoryInterface } from '@core/interfaces/channel-vidos.interface';
import { ActivatedRoute, Params } from '@angular/router';
import { VIDEO_FILTERS } from '@core/constants/global';

@Component({
    selector: 'app-channel-sorting',
    templateUrl: 'channel-sorting.component.html',
    styleUrls: ['channel-sorting.component.scss']
})

export class ChannelSortingComponent implements OnInit, OnDestroy {
    public channelCategory: ChannelCategoryInterface[] | undefined;
    private _category: number[] = [];
    private _uploadDataString: number | undefined;
    private _groupId: number | undefined;
    private _searchKey: string | '';
    public menuShow = false;

    constructor(
        private _channelsService: ChannelsService,
        private _route: ActivatedRoute
    ) {
        this._route.params.subscribe((params: Params) => {
            this._groupId = params.id;
        });
    }

    ngOnInit() {
        this.getCategory();
    }

    public doSomething(e: any) {
        this._searchKey = e.target.value;
        const obj = {
            id: this._groupId,
            category: this._category,
            search: this._searchKey
        };
        this._channelsService.getChannelVideosByChannelId(obj);
    }

    public getCategory() {
        this._channelsService.getChannelCategory()
            .subscribe((data: ChannelCategoryInterface[]) => {
                this.channelCategory = data;
            });
    }

    public setValueCategory(e: any, category) {
        if (e.checked && !this._category.some(data => data === category)) {
            this._category.push(category);
        } else {
            this._category = this._category.filter(data => data !== category);
        }
        const obj = {
            id: this._groupId,
            category: this._category,
            search: this._searchKey
        };
        console.log(obj);
        this._channelsService.getChannelVideosByChannelId(obj);
    }

    public uploadDataFunc(e: any) {
        this._uploadDataString = e;
        const obj = {
            id: this._groupId,
            category: this._category,
            search: this._searchKey,
            uploadDate: this._uploadDataString
        };
        this._channelsService.getChannelVideosByChannelId(obj);
    }

    public show() {
        this.menuShow = !this.menuShow;
    }

    ngOnDestroy() {
    }
}
