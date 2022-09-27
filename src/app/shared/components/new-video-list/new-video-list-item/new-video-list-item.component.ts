import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-new-video-list-item',
    templateUrl: 'new-video-list-item.component.html',
    styleUrls: ['new-video-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class AppNewVideoListItemComponent implements OnInit, OnDestroy {
    @Input() data;
    @Input() loading = true;

    constructor() {
    }

    ngOnInit() {
        console.log(this.loading, 'loading');
    }

    ngOnDestroy() {
    }
}
