import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PlaylistsService} from '@core/services/playlists.service';
import {VideoService} from '@core/services/video.service';
import {API_URL, DEFAULT_VIDEO_SUGGESTIONS_COUNT} from '@core/constants/global';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '@env';

@Component({
    selector: 'app-video-suggestions',
    templateUrl: './video-suggestions.component.html',
    styleUrls: ['./video-suggestions.component.scss']
})
export class VideoSuggestionsComponent implements OnInit {

    urlParams;
    videoId;
    playlistId;
    playlistData;

    playlistOpened = false;
    videoSuggestions = [];

    apiUrl = API_URL;
    authUser;

    isProduction = environment.production;


    constructor(
        private route: ActivatedRoute,
        private playlistsService: PlaylistsService,
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private dialog: MatDialog
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.urlParams = this.route.snapshot.queryParams;
        this.videoId = +this.urlParams?.id;
        this.playlistId = this.urlParams?.playlist_id;
        this.playlistOpened = !!this.playlistId;

        if (this.playlistOpened) {
            this.playlistsService.getById({playlist_id: this.playlistId}).subscribe(dt => {
                this.playlistData = dt;
            });
        }

        this.videoService.get({limit: DEFAULT_VIDEO_SUGGESTIONS_COUNT}).subscribe(dt => {
            this.videoSuggestions = dt.videos;
            console.log(dt)
        });

    }

    openVideoPage(video, playlistId = null) {
        const route = '/videos/play';
        const params = {id: video.id, playlist_id: playlistId};

        this.router.navigateByUrl('/', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([route], {queryParams: params})
        );

    }

    removeVideoFromPlaylist(video, playlistId) {
        this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.playlistsService.removeVideoFromPlaylist({
                    playlist_id: playlistId,
                    video_id: video.id
                }).subscribe(dt => {
                    const oldVideoIndex = this.playlistData.videos.indexOf(video);
                    this.playlistData.videos = dt.videos;
                    const nextVideo = this.playlistData.videos[oldVideoIndex];
                    if (nextVideo) {
                        this.openVideoPage(nextVideo);
                    }
                });
            }
        });
    }
}
