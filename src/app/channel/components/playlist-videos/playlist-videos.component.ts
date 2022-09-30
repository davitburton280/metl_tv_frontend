import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NewPlaylistService } from '@core/services/new-playlist.service';
import { Observable } from 'rxjs';
import { NewPlayListVideosInitialState } from '@core/interfaces/new-playlist.interface';

@Component({
    selector: 'app-playlist-videos',
    templateUrl: 'playlist-videos.component.html',
    styleUrls: ['playlist-videos.component.scss']
})

export class AppPlaylistVideosComponent implements OnInit, OnDestroy {
    private _ids: number | undefined;
    public dataSourcePlayListVideosState$: Observable<NewPlayListVideosInitialState> | undefined;
    public videoPath: any;

    constructor(
        private _route: ActivatedRoute,
        private _newPlayListService: NewPlaylistService
    ) {
        this._getIds();
        this.dataSourcePlayListVideosState$ =
            this._newPlayListService.newPlayListVideosState$.state$;
    }

    ngOnInit() {
        this.getVideos();
        console.log(this.dataSourcePlayListVideosState$);
    }

    private _getIds() {
        this._route.params.subscribe((params: Params) => {
            this._ids = params.id;
        });
    }

    private getVideos() {
        const params = {
            playlist_id: this._ids,
            user_id: 1
        };
        this._newPlayListService.getVideosPlayListById(params);
    }

    public getPLayVideoData(e: any) {
        this.videoPath = e;
    }

    ngOnDestroy() {
    }
}
