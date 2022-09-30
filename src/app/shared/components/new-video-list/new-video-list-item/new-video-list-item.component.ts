import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { buildPlayVideoRoute } from '@core/helpers/build-play-video-route';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-video-list-item',
    templateUrl: 'new-video-list-item.component.html',
    styleUrls: ['new-video-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class AppNewVideoListItemComponent implements OnInit, OnDestroy {
    @Input() data;
    @Input() loading = true;
    @Input() type;

    constructor(private router: Router) {
    }

    ngOnInit() {
        console.log(this.loading, 'loading');
    }

    public async openVideoPage(video, username) {
        console.log(video);
        const r = buildPlayVideoRoute(video, username);
        await this.router.navigate([r.route], { queryParams: r.params });
    }


    ngOnDestroy() {
    }
}
