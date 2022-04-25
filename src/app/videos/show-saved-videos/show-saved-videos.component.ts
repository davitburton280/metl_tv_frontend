import {Component, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {ChannelsService} from '@core/services/channels.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {API_URL} from '@core/constants/global';
import {buildPlayVideoRoute} from '@core/helpers/build-play-video-route';

@Component({
    selector: 'app-show-saved-videos',
    templateUrl: './show-saved-videos.component.html',
    styleUrls: ['./show-saved-videos.component.scss']
})
export class ShowSavedVideosComponent implements OnInit {

    userVideos;
    channelsVideos = [];
    apiUrl = API_URL;
    search;
    authUser;
    showSaved = false;

    constructor(
        private videoService: VideoService,
        public router: Router,
        private subject: SubjectService,
        private channelsService: ChannelsService,
        private route: ActivatedRoute,
        private getAuthUser: GetAuthUserPipe
    ) {
    }

    ngOnInit(): void {

        this.authUser = this.getAuthUser.transform();

        this.videoService.getUserSavedVideos({user_id: this.authUser.id}).subscribe(dt => {
            this.userVideos = dt;
            this.showSaved = true;
        });
    }

    async openVideoPage(video, username) {
        const r = buildPlayVideoRoute(video, username);
        await this.router.navigate([r.route], {queryParams: r.params});
    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

}
