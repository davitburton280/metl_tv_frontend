import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {patternValidator} from '@core/helpers/pattern-validator';
import trackByElement from '@core/helpers/track-by-element';
import {METL_URL_PATTERN} from '@core/constants/patterns';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import {GetSelectedVideosToBeAddedToPlaylistPipe} from '@shared/pipes/get-selected-videos-to-be-added-to-playlist.pipe';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-video-url-tab',
    templateUrl: './video-url-tab.component.html',
    styleUrls: ['./video-url-tab.component.scss']
})
export class VideoUrlTabComponent implements OnInit, OnDestroy {
    searchVideoByUrlForm: FormGroup;
    validUrl = true;
    searchedVideos = [];
    selectedVideos = [];
    trackByElement = trackByElement;
    subscriptions: Subscription[] = [];

    apiUrl = API_URL;

    searchingVideo = false;
    isSubmitted = false;
    @Input('playlist') playlist;
    @Output('selectVideo') selectVid = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private videoService: VideoService,
        public getSelectedVideos: GetSelectedVideosToBeAddedToPlaylistPipe,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.searchVideoByUrlForm = this.fb.group({
            url: ['', [Validators.required, patternValidator(METL_URL_PATTERN)]]
        });
    }

    getUrlString(e) {
        const possibleUrl = e.clipboardData?.getData('text') || e;
        this.isSubmitted = true;
        this.searchedVideos = [];
        this.getVideos(possibleUrl);
    }

    getVideos(possibleUrl) {
        this.validUrl = METL_URL_PATTERN.test(possibleUrl);
        if (this.validUrl) {
            const parsedUrl = new URL(possibleUrl);
            const id = parsedUrl.searchParams.get('id');
            if (id) {
                this.searchingVideo = true;
                this.videoService.getVideoById({id}).subscribe(dt => {
                    this.searchingVideo = false;
                    this.searchedVideos = dt ? [dt] : [];
                });
            }
        }
    }

    checkIfVideoSelected(id) {
        return this.selectedVideos.find(v => v === id);
    }

    selectVideo(video) {
        this.selectedVideos = this.getSelectedVideos.transform(video, this.selectedVideos, this.playlist);
        this.selectVid.emit(this.selectedVideos);
    }

    get urlCtrl(): AbstractControl {
        return this.searchVideoByUrlForm.get('url');
    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
