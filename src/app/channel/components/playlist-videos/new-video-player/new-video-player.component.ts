import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NewPlaylistService } from '@core/services/new-playlist.service';

@Component({
    selector: 'app-new-video-player',
    templateUrl: 'new-video-player.component.html',
    styleUrls: ['new-video-player.component.scss']
})


export class NewVideoPlayerComponent implements OnInit, OnDestroy {
    @Input() public videoPath: any;
    @ViewChild('videoPlayer') videoplayer: any;
    public startedPlay = false;
    public show = false;

    constructor(
        private _newPlayListVideo: NewPlaylistService
    ) {
    }

    ngOnInit() {
    }

    public pauseVideo(videoplayer) {
        videoplayer.nativeElement.play();
        // this.startedPlay = true;
        // if(this.startedPlay == true)
        // {
        setTimeout(() => {
            videoplayer.nativeElement.pause();
            if (videoplayer.nativeElement.paused) {
                this.show = !this.show;
            }
        }, 5000);
        // }
    }

    ngOnDestroy() {
    }
}
