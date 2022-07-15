import {Component, OnDestroy, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import {ActivatedRoute, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {ChannelsService} from '@core/services/channels.service';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {Subscription} from 'rxjs';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-show-videos',
    templateUrl: './show-videos.component.html',
    styleUrls: ['./show-videos.component.scss']
})
export class ShowVideosComponent implements OnInit, OnDestroy {
    items = {videos: [], playlists: []};
    channelsVideos = [];
    apiUrl = API_URL;
    search;
    selectedTag;
    authUser: CurrentUserData;
    showTrending = false;
    showFilters = false;
    filters = {video_type: 'videos'};
    filterStatus = 'idle';
    subscriptions: Subscription[] = [];
    loadingVideos = false;

    constructor(
        private videoService: VideoService,
        public router: Router,
        private subject: SubjectService,
        private channelsService: ChannelsService,
        private route: ActivatedRoute,
        private _userInfoService: UserInfoService,
        // private getAuthUser: GetAuthUserPipe,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe
    ) {
        this._getAuthInfo();
        // this.authUser = this.getAuthUser.transform();

        this.subscriptions.push(
            this.route.queryParams.subscribe(d => {
                this.search = this.route.snapshot.queryParams?.search;
                this.showTrending = this.router.url.includes('videos');
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

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Show videos  AUTHUSER DATA');
        });
    }

    getFilteredList(filters = {video_type: 'videos'}) {
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
