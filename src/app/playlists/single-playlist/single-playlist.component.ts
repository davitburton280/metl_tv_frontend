import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PlaylistsService} from '@core/services/playlists.service';
import {MatDialog} from '@angular/material/dialog';
import {AddVideoToPlaylistDialogComponent} from '@core/components/modals/add-video-to-playlist-dialog/add-video-to-playlist-dialog.component';
import {API_URL} from '@core/constants/global';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddVideoToAnotherPlaylistComponent} from '@core/components/modals/add-video-to-another-playlist/add-video-to-another-playlist.component';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-single-playlist',
    templateUrl: './single-playlist.component.html',
    styleUrls: ['./single-playlist.component.scss']
})
export class SinglePlaylistComponent implements OnInit {
    playlist;
    apiUrl = API_URL;
    authUser;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private playlistsService: PlaylistsService,
        private dialog: MatDialog,
        private getAuthUser: GetAuthUserPipe
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.getPlaylistDetails();
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
