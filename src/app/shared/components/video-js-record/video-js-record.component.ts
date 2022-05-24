import {
    Component,
    OnInit,
    OnDestroy,
    ElementRef, AfterViewInit, EventEmitter, Output, Input
} from '@angular/core';

import videojs from 'video.js';
import * as adapter from 'webrtc-adapter/out/adapter_no_global.js';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';

import watermark from 'videojs-watermark';
import 'videojs-watermark/dist/videojs-watermark.css';


import * as Record from 'videojs-record/dist/videojs.record.js';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {BlobToFilePipe} from '@shared/pipes/blob-to-file.pipe';
import {SubjectService} from '@core/services/subject.service';
import {Router} from '@angular/router';
import { API_URL } from '@core/constants/global';

@Component({
    selector: 'app-video-js-record',
    templateUrl: './video-js-record.component.html',
    styleUrls: ['./video-js-record.component.scss']
})
export class VideoJsRecordComponent implements OnInit, OnDestroy, AfterViewInit {

    apiUrl = API_URL;

    // index to create unique ID for component
    idx = 'clip1';
    authUser;
    recordingState = 'idle';
    videoId;
    recordingStartTimeStamp;
    recordingEndTimeStamp;
    readonly config: any;
    private player: any;
    private plugin: any;

    @Input() openViduToken;
    @Input() videoSettings;
    @Input() thumbnailFile;
    @Input() participants;

    @Output() shareScreen = new EventEmitter();
    @Output() recordingStarted = new EventEmitter();

    screenSharing = false;
    start;

    videoSRC = '';

    // constructor initializes our declared vars
    constructor(
        elementRef: ElementRef,
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        private blobToFile: BlobToFilePipe,
        private subject: SubjectService,
        public router: Router
    ) {


        this.player = false;

        // save reference to plugin (so it initializes)
        this.plugin = Record;

        // video.js configuration
        this.config = {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 640,
            height: 480,
            bigPlayButton: false,
            controlBar: {
                volumePanel: true
            },
            plugins: {
                /*
                // wavesurfer section is only needed when recording audio-only
                wavesurfer: {
                    backend: 'WebAudio',
                    waveColor: '#36393b',
                    progressColor: 'black',
                    debug: true,
                    cursorWidth: 1,
                    displayMilliseconds: true,
                    hideScrollbar: true,
                    plugins: [
                        // enable microphone plugin
                        WaveSurfer.microphone.create({
                            bufferSize: 4096,
                            numberOfInputChannels: 1,
                            numberOfOutputChannels: 1,
                            constraints: {
                                video: false,
                                audio: true
                            }
                        })
                    ]
                },
                */
                // configure videojs-record plugin
                record: {
                    audio: true,
                    // video: true,
                    video: {
                        frameRate: {ideal: 30, max: 30},
                        width: {min: 640, ideal: 640, max: 1280},
                        height: {min: 480, ideal: 480, max: 720}
                    },
                    screen: true,
                    displayMilliseconds: false,
                    maxLength: 3600, // 30
                    debug: true,
                    videoEngine: 'recordrtc',
                    videoMimeType: 'video/webm;codecs=h264',
                    // videoMimeType: 'video/x-matroska;codecs=avc1,opus',
                    // videoMimeType: 'video/webm;codecs=vp8,opus',
                    frameWidth: 640,
                    frameHeight: 480
                    // convertEngine: 'ts-ebml'
                },

                // videoJsResolutionSwitcher: {
                //     default: 'low', // Default resolution [{Number}, 'low', 'high'],
                //     dynamicLabel: true""
                // }

            }
        };
    }

    ngOnInit() {
        this.authUser = this.getAuthUser.transform();
    }

    // use ngAfterViewInit to make sure we initialize the videojs element
    // after the component template itself has been rendered
    ngAfterViewInit() {
        // ID with which to access the template's video element
        const el = 'video_' + this.idx;


        // setup the player via the unique element ID
        this.player = videojs(document.getElementById(el), this.config, () => {
            // console.log('player ready! id:', el);

            // print version information at startup
            const msg = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ' and recordrtc ' + RecordRTC.version;
            videojs.log(msg);
        }, () => {
            this.player.updateSrc([
                {
                    src: 'https://vjs.zencdn.net/v/oceans.mp4?SD',
                    type: 'video/mp4',
                    label: 'SD',
                    res: 360
                },
                {
                    src: 'https://vjs.zencdn.net/v/oceans.mp4?HD',
                    type: 'video/mp4',
                    label: 'HD',
                    res: 720
                }
            ]);
            this.player.on('resolutionchange', () => {
                console.log('Source changed to %s', this.player.src());
            });
        });

        videojs.registerPlugin('watermark', watermark);
        this.player.watermark({
            image: 'assets/img/logo.png',
            position: 'bottom-right',
            fadeTime: 1000
        });


        // device is ready
        this.player.on('deviceReady', (a) => {
            // console.log(a)
            this.shareScreen.emit();
            // console.log('device is ready!');
        });

        // users clicked the record button and started recording
        this.player.on('startRecord', (aa) => {
            // console.log(this.openViduToken)
            this.recordingState = 'active';
            this.subject.setVideoRecordingState({recording: true, viaSocket: false});

            // console.log('start timestamp:' + this.player.currentTimestamp)
            this.recordingStartTimeStamp = moment(this.player.currentTimestamp);
            this.start = new Date();
            // console.log(start);

            // this.thumbnailFile = this.videoSettings.thumbnail;
            console.log('+++++++++++++++++++++++ 200 ');
            this.videoService.liveVideoRefresh.emit();

            this.videoService.saveVideoToken({
                token: this.openViduToken,
                author_id: this.authUser.id,
                channel_id: this.authUser.channel.id,
                category_id: this.videoSettings.category_id,
                privacy: this.videoSettings.privacy,
                filename: '',
                session_name: this.videoSettings.sessionName,
                publisher: this.videoSettings.myUserName,
                status: 'live',
                thumbnail: this.videoSettings.thumbnail,
                name: this.videoSettings.name,
                description: this.videoSettings.description,
                tags: this.videoSettings.tags,
                participants: this.participants.length
            }).subscribe((dt) => {
                this.videoId = dt?.id;
                this.recordingStarted.emit(dt);
            });


            // console.log('started recording!');
        });


        // users completed recording and stream is available
        this.player.on('finishRecord', (e) => {
            // recordedData is a blob object containing the recorded data that
            // can be downloaded by the users, stored on server etc.
            // console.log('finished recording: ', this.player);
            // console.log(document.getElementsByTagName('video')[0].duration)
            // console.log('end timestamp:' + this.player.currentTimestamp)
            this.recordingEndTimeStamp = moment(this.player.currentTimestamp);
            // console.log('Duration timestamp:' + moment.
            // utc((moment.duration(this.recordingEndTimeStamp - this.recordingStartTimeStamp, 'seconds')
            // .asMilliseconds()).format('HH:mm')))

            const x = e.target.player.controlBar.durationDisplay.formattedTime_;
            const end = new Date();
            // tslint:disable-next-line:no-shadowed-variable
            const el = 'video_' + this.idx;
            const playerCastom = document.getElementById(el);
            // @ts-ignore



            // console.log(end - this.start);
            // tslint:disable-next-line:no-shadowed-variable

            console.log(this.player);
            // console.log(moment.utc(this.recordingEndTimeStamp.diff(this.recordingStartTimeStamp)));
            const recordingDuration = moment.utc(this.recordingEndTimeStamp.diff(this.recordingStartTimeStamp)).format('mm:ss');

            const fd: FormData = new FormData();
            fd.append('username', this.authUser.username);
            // fd.append('avatar', this.authUser.avatar);
            fd.append('id', this.videoId);
            fd.append('author_id', this.authUser.id);
            // fd.append('full_name', this.authUser.full_name);
            // fd.append('category_id', this.authUser._id);
            // fd.append('video_name', this.player.recordedData.name);
            fd.append('video_duration', recordingDuration);
            // fd.append('video_stream_file', this.blobToFile.transform(this.player.recordedData));
            // if (this.thumbnailFile) {
            //     fd.append('thumbnail', this.thumbnailFile.name);
            // }
            fd.append('video_settings', JSON.stringify(this.videoSettings));
            this.subject.setVideoRecordingState({recording: false});
            this.recordingState = 'finished';

            const formDataFile = new FormData();
            formDataFile.append('video', this.blobToFile.transform(this.player.recordedData));
            formDataFile.append('belonging', 'live_video');
            formDataFile.append('duration', recordingDuration);
            this.videoService.uploadFile(formDataFile, 'video').subscribe((res) => {
                console.log(res);

                // const video = document.getElementById('liveVideo');
                // this.videoSRC = this.apiUrl + 'uploads/videos/' + res.path;
                // console.log(video);
                // // tslint:disable-next-line:no-shadowed-variable
                // video.addEventListener('loadedmetadata', (e) => {
                //     console.log(e);
                //     // const duration = video.duration;
                //     // await console.log(duration);
                // });
                if (res) {
                    fd.append('video_name', res.path);
                    this.videoService.saveRecordedData(fd).subscribe(() => {
                        localStorage.setItem('session', '');
                        localStorage.setItem('video_settings', '');
                    });
                }
            });
        });

        // converter ready and stream is available
        this.player.on('finishConvert', () => {
            // the convertedData object contains the converted data that
            // can be downloaded by the users, stored on server etc.
            console.log('finished converting: ', this.player.convertedData);
        });

        // error handling
        this.player.on('error', (element, error) => {
            console.warn(error);
        });

        this.player.on('deviceError', () => {
            console.error('device error:', this.player.deviceErrorCode);
        });
    }


    // use ngOnDestroy to detach event handlers and remove the player
    ngOnDestroy(): void {
        if (this.player) {
            this.player.dispose();
            this.player = false;
        }
    }

}
