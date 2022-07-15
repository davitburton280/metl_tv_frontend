import {Component, OnDestroy, OnInit} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {Router} from '@angular/router';
import {AuthService} from '@core/services/auth.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {Subscription} from 'rxjs';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    videos = [];
    videosStreams = [];
    videosClipz = [];
    apiUrl = API_URL;
    authUser: CurrentUserData;

    subscriptions: Subscription[] = [];

    constructor(
        private videoService: VideoService,
        public router: Router,
        public auth: AuthService,
        private _userInfoService: UserInfoService,
        private socketService: SocketIoService,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
        this.getVideo();
        this.videoService.liveVideoRefresh.subscribe(() => {
            this.getVideo();
        });

        const params = {filters: {video_type: 'clipz'}};
        const filters = this.getExactParams.transform(params);

        this.videoService.get(filters).subscribe(dt => {
            this.videosClipz = dt.videos;
        });

        const params1 = {filters: {video_type: 'videos'}};
        const filters1 = this.getExactParams.transform(params1);

        this.videoService.get(filters1).subscribe(dt => {
            this.videosStreams = dt.videos;
        });
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Home Page  AUTHUSER DATA');
        });
    }

    getVideo() {
        this.subscriptions.push(this.videoService.get({}).subscribe(dt => {
            this.videos = dt.videos;
        }));
    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
