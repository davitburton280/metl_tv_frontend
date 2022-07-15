import {Component, Inject, OnInit} from '@angular/core';
import {PlaylistsService} from '@core/services/playlists.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-add-video-to-another-playlist',
    templateUrl: './add-video-to-another-playlist.component.html',
    styleUrls: ['./add-video-to-another-playlist.component.scss']
})
export class AddVideoToAnotherPlaylistComponent implements OnInit {
    playlists;
    saveToPlaylistsForm: FormGroup;
    addPlaylistForm: FormGroup;
    videoId;
    authUser: CurrentUserData;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private playlistsService: PlaylistsService,
        private fb: FormBuilder,
        private _userInfoService: UserInfoService,
        private dialog: MatDialogRef<AddVideoToAnotherPlaylistComponent>,
        // private getAuthUser: GetAuthUserPipe
    ) {
        this.videoId = data.video_id;
        this.playlists = data.playlists;
        // this.authUser = this.getAuthUser.transform();
        this._getAuthInfo();
        this.saveToPlaylistsForm = this.fb.group({
            video_id: [this.videoId, Validators.required],
            playlists: this.fb.array(
                this.getPlaylistsFormGroup(this.playlists)
            )
        });

        this.addPlaylistForm = this.fb.group({
            name: ['', Validators.required],
            channel_id: [this.authUser?.channel?.id],
            privacy: ['']
        });
    }

    ngOnInit(): void {
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Add video another playlist  AUTHUSER DATA');
        });
    }

    getPlaylistsFormGroup(playlists) {
        const ret = [];
        playlists.map(p => {
            const found = p.videos.find(v => v.id === this.videoId);
            ret.push(this.fb.group({id: p.id, name: p.name, privacy: p.privacy, checked: !!found}));
        });
        console.log(ret);
        return ret;
    }

    addToPlaylist(e, control) {

        control.patchValue({checked: e.target.checked});
        // console.log(this.playlistForm.value)
        // const value = id;
        // if (e.target.checked && !this.playlistIds.controls.find(c => c.value === value)) {
        //     // this.playlistIds.push(new FormControl(value));
        // } else {
        //     let i = 0;
        //     this.playlistIds.controls.forEach((item: FormControl) => {
        //         if (+item.value === value) {
        //             console.log('removing')
        //             // this.playlistIds.removeAt(i);
        //             return;
        //         }
        //         i++;
        //     });
        // }
    }

    checkIfVideoInPlaylist(videoId, playlist) {
        const found = playlist.videos.find(v => v.id === videoId);
        if (found && !this.playlistIds.controls.find(c => c.value === videoId)) {
            this.playlistIds.push(new FormControl(videoId));
        }
    }

    save() {
        this.playlistsService.addVideoToOtherPlaylists(this.saveToPlaylistsForm.value).subscribe(dt => {
            this.dialog.close();
        });
    }

    addPlaylist() {
        this.playlistsService.addPlaylist(this.addPlaylistForm.value).subscribe(dt => {
            this.playlistIds.controls.push(this.fb.group({
                id: dt.id,
                name: dt.name,
                privacy: +dt.privacy,
                checked: true
            }));
            this.addPlaylistForm.patchValue({name: '', privacy: ''});
        });
    }

    get playlistIds() {
        return this.saveToPlaylistsForm.controls.playlists as FormArray;
    }

}
