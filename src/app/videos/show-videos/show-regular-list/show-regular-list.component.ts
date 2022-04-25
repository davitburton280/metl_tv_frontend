import {Component, Input, OnInit} from '@angular/core';
import {buildPlayVideoRoute} from '@core/helpers/build-play-video-route';
import trackByElement from '@core/helpers/track-by-element';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'app-show-regular-list',
    templateUrl: './show-regular-list.component.html',
    styleUrls: ['./show-regular-list.component.scss']
})
export class ShowRegularListComponent implements OnInit {

    @Input() items;
    @Input() authUser;
    trackByElement = trackByElement;

    constructor(
        public router: Router
    ) {
    }

    ngOnInit(): void {
    }

    async openVideoPage(video, username) {
        const r = buildPlayVideoRoute(video, username);
        await this.router.navigate([r.route], {queryParams: r.params});
    }

    checkIfSavedByCurrentUser(video) {
        return video.users_vids.find(v => v.username === this.authUser?.username && v.users_videos.saved);
    }

    checkIfNewVideo(video) {
        const duration = moment.duration(moment().diff(video.created_at));
        return Math.floor(duration.asDays()) < 7;
    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

}
