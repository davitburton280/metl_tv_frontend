import {Component, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {ChannelsService} from '@core/services/channels.service';
import {API_URL} from '@core/constants/global';
import {buildPlayVideoRoute} from '@core/helpers/build-play-video-route';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

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
    authUser: CurrentUserData;
    showSaved = false;

    constructor(
        private videoService: VideoService,
        public router: Router,
        private subject: SubjectService,
        private channelsService: ChannelsService,
        private route: ActivatedRoute,
        private _userInfoService: UserInfoService
        // private getAuthUser: GetAuthUserPipe
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {

        // this.authUser = this.getAuthUser.transform();

        this.videoService.getUserSavedVideos({user_id: this.authUser.id}).subscribe(dt => {
            this.userVideos = dt;
            this.showSaved = true;
        });
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Show saved videos  AUTHUSER DATA');
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
