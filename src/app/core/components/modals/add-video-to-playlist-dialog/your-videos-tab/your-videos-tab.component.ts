import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import {GetSelectedVideosToBeAddedToPlaylistPipe} from '@shared/pipes/get-selected-videos-to-be-added-to-playlist.pipe';
import trackByElement from '@core/helpers/track-by-element';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-your-videos-tab',
    templateUrl: './your-videos-tab.component.html',
    styleUrls: ['./your-videos-tab.component.scss']
})
export class YourVideosTabComponent implements OnInit, OnDestroy {
    apiUrl = API_URL;
    selectedVideos = [];
    trackByElement = trackByElement;
    subscriptions: Subscription[] = [];

    @Input('currentUser') currentUser;
    @Input('authUser') authUser;
    @Input('playlist') playlist;

    @Output('selectVideo') selectVid = new EventEmitter();

    constructor(
        private videoService: VideoService,
        public getSelectedVideos: GetSelectedVideosToBeAddedToPlaylistPipe,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.subscriptions.push(this.videoService.getUserVideos({user_id: this.authUser.id}).subscribe(dt => {
            this.currentUser = dt;
        }));

    }

    ifVideoSelected(id) {
        return this.selectedVideos.find(v => v === id);
    }

    selectVideo(video) {
        this.selectedVideos = this.getSelectedVideos.transform(video, this.selectedVideos, this.playlist);
        this.selectVid.emit(this.selectedVideos);
    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
