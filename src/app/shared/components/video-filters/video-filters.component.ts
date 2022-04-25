import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {VIDEO_FILTERS} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import trackByElement from '@core/helpers/track-by-element';

@Component({
    selector: 'app-video-filters',
    templateUrl: './video-filters.component.html',
    styleUrls: ['./video-filters.component.scss']
})
export class VideoFiltersComponent implements OnInit {
    filters = VIDEO_FILTERS;
    selectedFilters = {};
    subscriptions: Subscription[] = [];
    trackByElement = trackByElement;

    @Output('filter') filterAction = new EventEmitter();

    constructor(
        private videoService: VideoService,
        private ifObjectEmpty: CheckForEmptyObjectPipe,
        private subjectService: SubjectService
    ) {
    }

    ngOnInit(): void {
        this.subscriptions.push(this.subjectService.getToggleFiltersData().subscribe(dt => {
            this.selectedFilters = {};
            this.filterAction.emit(this.selectedFilters);
        }));
    }

    applyFilter({name, value}, group) {
        this.selectedFilters[group] = {name, value};
        this.filterAction.emit(this.selectedFilters);
    }

    removeFilter({name, value}, group) {
        delete this.selectedFilters[group];
        // if (this.ifObjectEmpty.transform(this.selectedFilters)) {
        // this.selectedFilters = {};
        // }

        this.filterAction.emit(this.selectedFilters);
    }

}
