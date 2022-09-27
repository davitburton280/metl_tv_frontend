import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ChannelsService } from '@core/services/channels.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewPlaylistService } from '@core/services/new-playlist.service';

@Component({
    selector: 'app-create-playlist-dialog',
    templateUrl: 'create-playlist-dialog.component.html',
    styleUrls: ['create-playlist-dialog.component.scss']
})

export class CreatePlaylistDialogComponent implements OnInit, OnDestroy {
    private _unsubscribe$ = new Subject<void>();
    public createPlayListFormGroup: FormGroup | any;

    constructor(
        private _fb: FormBuilder,
        private dialogRef: MatDialogRef<CreatePlaylistDialogComponent>,
        private _newPlaylistService: NewPlaylistService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit(): void {
        this._formBuilder();
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

    ngOnDestroy(): void {
    }
}
