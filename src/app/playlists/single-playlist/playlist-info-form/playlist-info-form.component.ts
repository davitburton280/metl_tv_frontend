import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {API_URL} from '@core/constants/global';
import {PlaylistsService} from '@core/services/playlists.service';
import {AddVideoToPlaylistDialogComponent} from '@core/components/modals/add-video-to-playlist-dialog/add-video-to-playlist-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-playlist-info-form',
    templateUrl: './playlist-info-form.component.html',
    styleUrls: ['./playlist-info-form.component.scss']
})
export class PlaylistInfoFormComponent implements OnInit {
    playlistInfoForm: FormGroup;
    apiUrl = API_URL;
    editMode = false;
    authUser: CurrentUserData;

    @Input('playlist') playlist;
    @Output('refreshPlaylist') refreshPlaylist = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private playlistsService: PlaylistsService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        public router: Router,
        private _userInfoService: UserInfoService
        // private getAuthUser: GetAuthUserPipe
    ) {
        this.playlistInfoForm = this.fb.group({
            id: [''],
            name: ['', Validators.required],
            description: [''],
            privacy: ['']
        });
        this._getAuthInfo();
        // this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Playlist info form AUTHUSER DATA');
        });
    }

    openVideosModal() {
        this.dialog.open(AddVideoToPlaylistDialogComponent, {data: {playlist: this.playlist}}).afterClosed().subscribe(dt => {
            this.refreshPlaylist.emit();
        });
    }

    updatePrivacy(value, playlist) {
        console.log(+value);
        playlist.privacy = +value;
        this.playlistInfoForm.patchValue({privacy: +value});
        this.playlistsService.updatePrivacy({privacy: value, id: playlist.id}).subscribe(dt => {
            this.toastr.success('Playlist privacy is updated successfully');
        });

    }

    editPlaylistInfo(playlist) {
        this.editMode = true;
        this.playlistInfoForm.patchValue(playlist);
    }

    savePlaylistInfoChanges() {
        if (this.playlistInfoForm.valid) {
            this.playlistsService.updatePlaylistInfo(this.playlistInfoForm.value).subscribe((dt) => {
                this.editMode = false;
                this.playlist = dt;
            });
        }
    }

    openPlaylistPage(playlist) {
        const route = 'videos/play';
        const params = {id: playlist.videos?.[0]?.id, playlist_id: playlist.id};
        this.router.navigate([route], {queryParams: params});
    }

    backToPlaylists() {
        const route = 'channels/show';
        const params = {tab: 'playlists', username: this.authUser.username};
        this.router.navigate([route], {queryParams: params});
    }

}
