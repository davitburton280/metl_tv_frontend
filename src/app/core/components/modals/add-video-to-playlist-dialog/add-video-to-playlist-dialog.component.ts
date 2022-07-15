import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {PlaylistsService} from '@core/services/playlists.service';
import {ToastrService} from 'ngx-toastr';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-add-video-to-playlist-dialog',
    templateUrl: './add-video-to-playlist-dialog.component.html',
    styleUrls: ['./add-video-to-playlist-dialog.component.scss']
})
export class AddVideoToPlaylistDialogComponent implements OnInit {
    activeTab = 'yours';
    authUser: CurrentUserData;
    currentUser;
    selectedVideos = [];
    playlist;


    @ViewChild('urlInput') urlInput;

    constructor(
        private modal: MatDialogRef<AddVideoToPlaylistDialogComponent>,
        private videoService: VideoService,
        private playlistsService: PlaylistsService,
        private _userInfoService: UserInfoService,
        // private getAuthUser: GetAuthUserPipe,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.playlist = data.playlist;
        this._getAuthInfo();
        // this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Add video to playlist AUTHUSER DATA');
        });
    }

    selectVideo(videos) {
        this.selectedVideos = videos;
    }

    changeTab(tab) {
        this.activeTab = tab;
        this.selectedVideos = [];
    }


    addVideos() {
        if (this.selectedVideos.length > 0) {
            const params = {playlist_id: this.playlist.id, video_ids: JSON.stringify(this.selectedVideos)};
            this.playlistsService.addVideosToPlaylist(params).subscribe(dt => {
                this.modal.close();
            });
        } else {
            this.toastr.error('Please select at least one video', 'No videos selected');
        }
    }

    cancel() {
        this.modal.close();
    }

    ifSubmitInactive(activeTab) {
        if (activeTab === 'yours') {
            return this.currentUser?.videos?.length === 0;
        }

    }

}
