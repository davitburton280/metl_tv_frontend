import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PlaylistsService} from '@core/services/playlists.service';
import {MatDialog} from '@angular/material/dialog';
import {API_URL} from '@core/constants/global';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-single-playlist',
    templateUrl: './single-playlist.component.html',
    styleUrls: ['./single-playlist.component.scss']
})
export class SinglePlaylistComponent implements OnInit {
    playlist;
    apiUrl = API_URL;
    authUser: CurrentUserData;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private playlistsService: PlaylistsService,
        private dialog: MatDialog,
        private _userInfoService: UserInfoService
        // private getAuthUser: GetAuthUserPipe
    ) {
        this._getAuthInfo();
        // this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.getPlaylistDetails();
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Single playlist AUTHUSER DATA');
        });
    }


    getPlaylistDetails() {

        const playlistId = this.route.snapshot?.params?.id;

        if (playlistId) {
            this.playlistsService.getById({playlist_id: playlistId, user_id: this.authUser}).subscribe(dt => {
                this.playlist = dt;
            });
        }
    }


}
