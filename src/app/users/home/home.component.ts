import {Component, OnDestroy, OnInit} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {Router} from '@angular/router';
import {AuthService} from '@core/services/auth.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {ChatService} from '@core/services/chat.service';
import {Subscription} from 'rxjs';
import { FilterOutFalsyValuesFromObjectPipe } from "@shared/pipes/filter-out-falsy-values-from-object.pipe";

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
    authUser;

    subscriptions: Subscription[] = [];

    constructor(
        private videoService: VideoService,
        public router: Router,
        public auth: AuthService,
        private getAuthUser: GetAuthUserPipe,
        private socketService: SocketIoService,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe
    ) {
    }

    ngOnInit(): void {
        this.getVideo();
        this.authUser = this.getAuthUser.transform();
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
