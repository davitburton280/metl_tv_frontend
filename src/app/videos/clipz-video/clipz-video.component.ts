import { Component, OnDestroy, OnInit } from "@angular/core";
import { GetAuthUserPipe } from '@shared/pipes/get-auth-user.pipe';
import { VideoService } from '@core/services/video.service';
import { FilterOutFalsyValuesFromObjectPipe } from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import { ChannelsService } from '@core/services/channels.service';
import { API_URL } from '@core/constants/global';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '@core/services/subject.service';

@Component({
  selector: 'app-clipz-video',
  templateUrl: './clipz-video.component.html',
  styleUrls: ['./clipz-video.component.scss']
})
export class ClipzVideoComponent implements OnInit, OnDestroy {

    items = {videos: [], playlists: []};
    channelsVideos = [];
    apiUrl = API_URL;
    search;
    selectedTag;
    authUser;
    showTrending = false;
    showFilters = false;
    filters = {video_type: 'clipz'};
    filterStatus = 'idle';
    subscriptions: Subscription[] = [];
    loadingVideos = false;

    constructor(
        private videoService: VideoService,
        public router: Router,
        private subject: SubjectService,
        private channelsService: ChannelsService,
        private route: ActivatedRoute,
        private getAuthUser: GetAuthUserPipe,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe
    ) {
        this.authUser = this.getAuthUser.transform();

        this.subscriptions.push(
            this.route.queryParams.subscribe(d => {
                this.search = this.route.snapshot.queryParams?.search;
                this.showTrending = this.router.url.includes('clipz');
                this.selectedTag = this.route.snapshot.queryParams?.tag;
                if (this.search) {
                    this.searchChannelsVideos({search: this.search, filters: this.filters});
                } else {
                    this.getVideosList({search: this.search, filters: this.filters, tag: this.selectedTag});
                }
            }));


    }

    ngOnInit(): void {
    }

    getFilteredList(filters = {video_type: 'clipz'}) {
        this.filters = filters;
        this.filterStatus = 'applied';
        if (this.search) {
            this.searchChannelsVideos({search: this.search, filters: this.filters});
        } else {
            this.getVideosList({filters: this.filters});
        }
    }

    getVideosList(params) {
        params = this.getExactParams.transform(params);

        this.videoService.get({
            withPlaylists: !this.showTrending ? 1 : 0,
            trending: this.showTrending ? 1 : 0,
            ...params
        }).subscribe(dt => {
            this.items = dt;
        });
    }

    searchChannelsVideos(params) {
        console.log(params);

        params = this.getExactParams.transform(params);
        this.loadingVideos = true;

        this.channelsService.searchWithVideos({user_id: this.authUser?.id, ...params}).subscribe(dt => {
            this.loadingVideos = false;
            this.channelsVideos = dt;
        });
    }


    isFiltersShown() {
        return this.items.videos?.length > 0 ||
            (this.search && this.channelsVideos.find(v => v.videos.length > 0))
            || this.filterStatus === 'applied' && !this.loadingVideos;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
