import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PlaylistsService} from '@core/services/playlists.service';

@Component({
    selector: 'app-add-playlist-dialog',
    templateUrl: './add-playlist-dialog.component.html',
    styleUrls: ['./add-playlist-dialog.component.scss']
})
export class AddPlaylistDialogComponent implements OnInit {
    addPlaylistForm: FormGroup;
    isSubmitted = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private modal: MatDialogRef<AddPlaylistDialogComponent>,
        private fb: FormBuilder,
        private playlistService: PlaylistsService
    ) {
        console.log(data)
        this.addPlaylistForm = this.fb.group({
            channel_id: data.channel_id,
            name: ['', Validators.required],
            description: ['', Validators.required],
            privacy: ['', Validators.required]
        });
    }

    ngOnInit(): void {
    }

    createPlaylist() {
        this.isSubmitted = true;
        if (this.addPlaylistForm.valid) {
            this.playlistService.addPlaylist(this.addPlaylistForm.value).subscribe(dt => {
                this.modal.close();
            });
        }
    }

    cancel() {
        this.modal.close();
    }

    get nameCtrl(): AbstractControl {
        return this.addPlaylistForm.get('name');
    }

    get privacyCtrl(): AbstractControl {
        return this.addPlaylistForm.get('privacy');
    }

    get descCtrl(): AbstractControl {
        return this.addPlaylistForm.get('description');
    }


}
