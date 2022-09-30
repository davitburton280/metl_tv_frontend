import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewPlaylistService } from '@core/services/new-playlist.service';
import { NewPlayListInitialState } from '@core/interfaces/new-playlist.interface';

@Component({
    selector: 'app-add-video-playlist',
    templateUrl: 'add-video-playlist.component.html',
    styleUrls: ['add-video-playlist.component.scss']
})

export class AddVideoPlaylistComponent implements OnInit, OnDestroy {
    private _unsubscribe$ = new Subject<void>();
    public createPlayListFormGroup: FormGroup | any;
    public dataSourcePlayList$: Observable<NewPlayListInitialState> | undefined;

    constructor(
        private _fb: FormBuilder,
        private dialogRef: MatDialogRef<AddVideoPlaylistComponent>,
        private _newPlaylistService: NewPlaylistService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log(this.data.id, 'dsadsad');
        this.dataSourcePlayList$ = this._newPlaylistService.newPlaylistState$.state$;
    }

    ngOnInit(): void {
        this._formBuilder();
        this._newPlaylistService.getAllPlayList();
    }

    private _formBuilder(): void {
        this.createPlayListFormGroup = this._fb.group({
            name: [null, Validators.required],
            privacy: [null, Validators.required]
        });
    }

    public create() {
        const obj = {
            name: this.createPlayListFormGroup.get('name').value,
            description: 'text',
            privacy: this.createPlayListFormGroup.get('privacy').value
        };
        this._newPlaylistService.createPlayList(obj);
        this.dialogRef.close();
    }

    public close() {
        this.dialogRef.close();
    }

    public setVideoPlayList(playList_id) {
        console.log(this.data.id);
        const formData = {
            video_ids: [this.data.id],
            playlist_id: playList_id
        };
        this._newPlaylistService.setVideoPlayList(formData)
            .subscribe((data: any) => {
                console.log(data);
            });
    }

    ngOnDestroy(): void {
    }
}
