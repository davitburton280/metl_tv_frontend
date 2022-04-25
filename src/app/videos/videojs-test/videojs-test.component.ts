import {AfterViewInit, Component, OnInit} from '@angular/core';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';

@Component({
    selector: 'app-videojs-test',
    templateUrl: './videojs-test.component.html',
    styleUrls: ['./videojs-test.component.scss']
})
export class VideojsTestComponent implements OnInit, AfterViewInit {
    config = {
        controls: true,
        bigPlayButton: false,
        width: 320,
        height: 240,
        fluid: false,
        plugins: {
            record: {
                audio: true,
                video: true,
                maxLength: 110,
                debug: true
            }
        }
    };
    player;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.player = videojs(document.getElementById('video'), this.config, () => {
            // console.log('player ready! id:', el);

            // print version information at startup
            const msg = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ' and recordrtc ' + RecordRTC.version;
            videojs.log(msg);
        }, () => {
        });

        let player = this.player;

        this.player.on('finishRecord', () => {
            // the blob object contains the recorded data that
            // can be downloaded by the user, stored on server etc.
            console.log('finished recording: ', player.recordedData);
            // player.record().saveAs({'video': 'my-video-file-name.webm'});
        });

    }
}
