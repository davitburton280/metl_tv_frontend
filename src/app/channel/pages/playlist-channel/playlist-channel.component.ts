import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewPlaylistService } from '@core/services/new-playlist.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { NewPlayListInitialState } from '@core/interfaces/new-playlist.interface';

@Component({
    selector: 'app-playlist-channel',
    templateUrl: './playlist-channel.component.html',
    styleUrls: ['playlist-channel.component.scss']
})

export class PlaylistChannelComponent implements OnInit, OnDestroy {
    public dataSourcePlayListState$: Observable<NewPlayListInitialState> | undefined;
    public createPostGroup: FormGroup | unknown;

    constructor(
        private _fb: FormBuilder,
        private _newPlaylistService: NewPlaylistService
    ) {
        this.dataSourcePlayListState$ = this._newPlaylistService.newPlaylistState$.state$;
    }

    ngOnInit() {
        this._newPlaylistService.getAllPlayList();
    }



    ngOnDestroy() {
    }
}
