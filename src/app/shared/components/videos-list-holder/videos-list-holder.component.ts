import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {buildPlayVideoRoute} from '@core/helpers/build-play-video-route';
import trackByElement from '@core/helpers/track-by-element';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {VideoService} from '@core/services/video.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import { finished } from 'stream';

@Component({
    selector: 'app-videos-list-holder',
    templateUrl: './videos-list-holder.component.html',
    styleUrls: ['./videos-list-holder.component.scss']
})
export class VideosListHolderComponent implements OnInit, OnDestroy {

    authUser;
    videoLoading = 'idle';
    trackByElement = trackByElement;
    subscriptions: Subscription[] = [];

    @Input() videos = [];
    @Input() title = '';
    @Input() removable = false;
    @Input() detailsSource;

    constructor(
        private getAuthUser: GetAuthUserPipe,
        private videoService: VideoService,
        public router: Router,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.videoLoading = 'loading';
        if (this.videos?.length > 0) {
            this.videoLoading = 'finished';
        }
    }

    async openVideoPage(video, username) {
        const r = buildPlayVideoRoute(video, username);
        await this.router.navigate([r.route], {queryParams: r.params});
    }

    async openChannelPage(username) {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(async () =>
            await this.router.navigate(['channels/' + username])
        );
    }

    removeVideo(video) {
        console.log(video);
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.videoService.removeVideo({
                    id: video.id,
                    filename: video.filename,
                    username: this.authUser.username
                }).subscribe(dt => {
                    this.toastr.success('The video was removed successfully');
                    this.videos = dt.videos;
                });
            }
        }));

    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

    isChannelPage() {
        return this.router.url.includes('channel') && this.removable;
    }


    updatePrivacy(video, privacy) {
        this.subscriptions.push(this.videoService.updatePrivacy({
            video_id: video.id,
            privacy: privacy === 'Public' ? 'Private' : 'Public'
        }).subscribe(dt => {
            video.privacy = dt;
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
