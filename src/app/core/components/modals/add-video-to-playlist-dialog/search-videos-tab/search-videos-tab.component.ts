import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {GetSelectedVideosToBeAddedToPlaylistPipe} from '@shared/pipes/get-selected-videos-to-be-added-to-playlist.pipe';
import trackByElement from '@core/helpers/track-by-element';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-search-videos-tab',
    templateUrl: './search-videos-tab.component.html',
    styleUrls: ['./search-videos-tab.component.scss']
})
export class SearchVideosTabComponent implements OnInit, OnDestroy {
    searchedVideos = [];
    selectedVideos = [];
    searched = false;
    trackByElement = trackByElement;
    subscriptions: Subscription[] = [];

    @Input('playlist') playlist;
    @Output('selectVideo') selectVid = new EventEmitter();

    constructor(
        private videoService: VideoService,
        public getSelectedVideos: GetSelectedVideosToBeAddedToPlaylistPipe,
        public router: Router
    ) {
    }

    ngOnInit(): void {
    }

    searchVideos(e) {
        this.searched = true;
        this.subscriptions.push(this.videoService.searchInAllVideos(e).subscribe(dt => {
            this.searchedVideos = dt;
        }));
    }

    checkIfVideoSelected(id) {
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
