import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewVideosService } from '@core/services/new-videos.service';
import { Observable } from 'rxjs';
import { NewVideoStateInitial } from '@core/interfaces/new-vidos.interface';
import { ClipsStateInitial } from '@core/interfaces/clips.interface';

@Component({
    selector: 'app-new-video-list',
    templateUrl: 'new-video-list.component.html',
    styleUrls: ['new-video-list.component.scss']
})


export class AppNewVideoListComponent implements OnInit, OnDestroy {
    public newVideoDataSource$: Observable<NewVideoStateInitial> | undefined;
    public tradingVideoDataSource$: Observable<NewVideoStateInitial> | undefined;
    public clipsDataSource$: Observable<ClipsStateInitial> | undefined;
    private _limit = 3;
    private _page = 1;
    private _tag = null;
    private sort = {
        key: 'created_at',
        value: 'DESC'
    };
    public totalPageCount;

    constructor(
        private _newVideosService: NewVideosService,
    ) {
        this.newVideoDataSource$ = this._newVideosService.newVideosState$.state$;
        this.tradingVideoDataSource$ = this._newVideosService.tradingVideosState$.state$;
        this.clipsDataSource$ = this._newVideosService.clipsState$.state$;
    }

    ngOnInit() {
        this.getNewVideo();
        this.getTradingVideo();
        this._getTotalPage();
        this.getClips();
    }

    public getClips() {
        const FORM_DATA = {
            limit: this._limit,
            page: this._page,
            tag: this._tag,
            video_type: {
                clipz: 'clipz',
                videos: 'videos'
            }
        };
        this._newVideosService.getClipsVideosApi(FORM_DATA);
    }

    public onPageClipChanged(e) {
        const FORM_DATA = {
            limit: this._limit,
            page: e.pageIndex,
            tag: this._tag,
            video_type: {
                clipz: 'clipz',
                videos: 'videos'
            }
        };
        this._newVideosService.getClipsVideosApi(FORM_DATA);
    }

    public getNewVideo() {
        const FORM_DATA = {
            limit: this._limit,
            page: this._page,
            tag: this._tag,
            sort: this.sort
        };
        this._newVideosService.getNewVideosApi(FORM_DATA);
    }

    public onPageNewChanged(e) {
        const FORM_DATA = {
            limit: this._limit,
            page: e.pageIndex,
            tag: this._tag,
            sort: this.sort
        };
        this._newVideosService.getNewVideosApi(FORM_DATA);
    }

    public getTradingVideo() {
        const FORM_DATA = {
            limit: this._limit,
            page: this._page,
            tag: this._tag,
            sort: {
                key: 'views',
                value: 'DESC'
            }
        };
        this._newVideosService.getTradingVideosApi(FORM_DATA);
    }

    public onPageChanged(e) {
        const FORM_DATA = {
            limit: this._limit,
            page: e.pageIndex,
            tag: this._tag,
            sort: {
                key: 'views',
                value: 'DESC'
            }
        };
        this._newVideosService.getTradingVideosApi(FORM_DATA);
    }

    private _getTotalPage() {
        this._newVideosService.newPageTotalCount
            .subscribe((data) => {
                this.totalPageCount = data;
            });

    }


    ngOnDestroy() {
    }
}
