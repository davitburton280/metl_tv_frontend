import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ConnectionEvent, OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber} from 'openvidu-browser';
import {OpenviduService} from '@core/services/openvidu.service';
import {SubjectService} from '@core/services/subject.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {VideoService} from '@core/services/video.service';
import {ActivatedRoute, Router} from '@angular/router';
import {API_URL} from '@core/constants/global';
import {MatDialog} from '@angular/material/dialog';
import {LoaderService} from '@core/services/loader.service';
import {ChatService} from '@core/services/chat.service';
import {StocksService} from '@core/services/stocks.service';
import {VideoChatService} from '@core/services/video-chat.service';
import {UsersService} from '@core/services/users.service';
import {Subscription} from 'rxjs';
import {SocialShareDialogComponent} from '@core/components/modals/social-share-dialog/social-share-dialog.component';
import {GetUriPartsPipe} from '@shared/pipes/get-uri-parts.pipe';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {


    videoJSPlayerOptions = {
        autoplay: true,
        controls: true,
        fluid: false,
        sources: []
    };

    videoSettings;
    savedVideoSettings;

    videoId;


    OPENVIDU_SERVER_URL = 'https://localhost:4443';
    OPENVIDU_SERVER_SECRET = 'MY_SECRET';

    // OpenVidu objects
    OV: OpenVidu;
    session: Session;
    publisher: StreamManager; // Local
    subscribers: StreamManager[] = []; // Remotes


    @ViewChild('video') videoEl;

    // Main video of the page, will be 'publisher' or one of the 'subscribers',
    // updated by click event in UserVideoComponent children
    mainStreamManager: StreamManager;

    authUser: CurrentUserData;
    openViduToken;

    recordingState = 'idle';

    webcams = [];
    tags = [];

    participants = [];


    thumbnailFile;
    thumbnailUploaded = false;
    apiUrl = API_URL;
    shareUrl;

    publisherData;
    sessionData = {sessionName: '', myUserName: ''};

    sessionName;
    userStocks = [];
    messages = [];

    channelUser;

    subscriptions: Subscription[] = [];

    constructor(
        private ref: ChangeDetectorRef,
        private toastr: ToastrService,
        private elRef: ElementRef,
        private openViduService: OpenviduService,
        private subject: SubjectService,
        private _userInfoService: UserInfoService,
        private videoService: VideoService,
        private chatService: ChatService,
        private videoChatService: VideoChatService,
        private stocksService: StocksService,
        public router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        public loader: LoaderService,
        private usersService: UsersService,
        private getUrlParts: GetUriPartsPipe
    ) {
        this._getUserInfo();
    }

    ngOnInit(): void {
        this.getUserChannel();

        this.getVideoSessionData();
        if (this.sessionData && this.videoSettings) {
            this.joinSession();
        }


        this.subscriptions.push(this.subject.getVideoRecordingState().subscribe(data => {

            if (data.recordingState === 'finished') {
                this.leaveSession();
            }

            if (!data.viaSocket) {
                this.sendRecordingState(data.recording);
            }
        }));

        this.subscriptions.push(this.stocksService.getUserStocks({user_id: this.authUser.id}).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
        }));


    }

    private _getUserInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Video');
        });
    }

    @HostListener('window:beforeunload')
    beforeunloadHandler() {
        // On window closed leave session
        this.leaveSession();
        if (this.recordingState === 'started') {
            this.removeLiveVideoByToken();
        }
        // return false;
    }

    alertOfLeaving() {
        this.toastr.error('Please stop recording first');
    }

    getUserChannel() {
        this.subscriptions.push(this.usersService.getUserInfo({
            username: this.authUser.username,
        }).subscribe(dt => {
            this.channelUser = dt;
        }));
    }

    getVideoSessionData() {
        const savedSession = localStorage.getItem('session');
        const videoSettings = localStorage.getItem('video_settings');
        this.sessionData = savedSession ? JSON.parse(savedSession) : null;
        this.videoSettings = videoSettings ? JSON.parse(videoSettings) : null;
        console.log(this.videoSettings, this.sessionData);
    }


    joinSession() {
        this.OV = new OpenVidu();

        this.session = this.OV.initSession();
        this.getStreamEvents();

        this.loader.dataLoading = true;

        this.subscriptions.push(this.openViduService.getToken({
            email: this.authUser.email,
            sessionName: this.sessionData.sessionName,
            role: 'PUBLISHER'
        }).subscribe((token: any) => {
            console.log(token);
            // const {token} = data;
            this.openViduToken = token;
            this.receiveMessage();
            this.receiveRecordingState();


            // console.log(token)
            // console.log({clientData: this.joinSessionForm.value.myUserName})
            this.session.connect(token, {
                clientData: this.sessionData,
                avatar: this.authUser.avatar,
                from_user: this.authUser
            })
                .then(() => {
                    this.loader.dataLoading = false;
                    if (token.includes('PUBLISHER')) {
                        const video = this.elRef.nativeElement.querySelector('video');
                        const publisher: Publisher = this.OV.initPublisher(video, {
                            audioSource: undefined, // The source of audio. If undefined default microphone
                            videoSource: undefined, // The source of video. If undefined default webcam
                            publishAudio: true,     // Whether you want to start publishing with your audio unmuted or not
                            publishVideo: true,     // Whether you want to start publishing with your video enabled or not
                            resolution: '640x480',  // The resolution of your video
                            frameRate: 30,          // The frame rate of your video
                            insertMode: 'APPEND',   // How the video is inserted in the target element 'video-container'
                            mirror: false           // Whether to mirror your local video or not
                        });
                        console.log(publisher);
                        this.session.publish(publisher);

                        // Set the main video in the page to display our webcam and store our Publisher
                        this.mainStreamManager = publisher;
                        this.publisher = publisher;
                    } else {

                    }
                }).catch((err) => {
                this.toastr.error('There was a problem white loading streaming session');
                console.log(err);
            });

        }));

    }

    getStreamEvents() {
        this.session.on('streamCreated', (event: StreamEvent) => {

            const video = this.elRef.nativeElement.querySelector('video');
            this.thumbnailFile = this.videoSettings.thumbnail;
            // const video = undefined;
            // console.log('stream created', video)
            // console.log(event.stream)

            const subscriber: Subscriber = this.session.subscribe(event.stream, undefined
                // {
                //   insertMode: 'append'
                // },
                // (error) => {
                //   console.log(error)
                //   if (error) {
                //     console.log('error: ' + error.message);
                //   } else {
                //     console.log('callback')
                //     // this.handleScreenShare(event.stream.videoType);
                //     // this.getVideo(event.stream);
                //
                //   }
                // }
            );

        });

        this.session.on('connectionCreated', (event: ConnectionEvent) => {
            // console.log('connection created!!!')
            const connection = JSON.parse(event.connection.data.replace(/}%\/%{/g, ','));
            // console.log(event.connection.data)
            // this.toastr.success(from.clientData.myUserName + 'joined the session');
            this.participants.push(connection.clientData.myUserName);
        });

        this.session.on('connectionDestroyed', (event: ConnectionEvent) => {
            // console.log('connection destroyed!!!')
            const connection = JSON.parse(event.connection.data.replace(/}%\/%{/g, ','));
            this.participants = this.participants.filter(p => p !== connection.clientData.myUserName);
        });

        // On every Stream destroyed...
        this.session.on('streamDestroyed', (event: StreamEvent) => {

            // console.log('stream destroyed!!!!!')
            // console.log(event)

            // Remove the stream from 'subscribers' array
            this.deleteSubscriber(event.stream.streamManager);
            this.leaveSession();
        });
    }

    updateMainStreamManager(streamManager: StreamManager) {
        this.mainStreamManager = streamManager;
    }


    deleteSubscriber(streamManager: StreamManager) {
        console.log(this.subscribers);
    }

    getRecordedVideoId(video) {
        this.savedVideoSettings = video;

        this.videoId = video?.id;
        const {hostName} = this.getUrlParts.transform(window.location.href);
        this.shareUrl = `${hostName}users/video/watch?session=${this.sessionData.sessionName}&publisher=${this.authUser.username}&id=${this.videoId}`;
    }

    leaveSession() {
        console.log('leaving session!!!');
        if (this.session) {
            this.session.disconnect();
        }

        // Empty all properties...
        this.subscribers = [];
        delete this.publisher;
        delete this.session;
        delete this.OV;


        this.thumbnailFile = [];
        this.thumbnailUploaded = false;

        if (this.sessionData) {

            this.subscriptions.push(this.openViduService.leaveSession({
                token: this.openViduToken,
                sessionName: this.sessionData.sessionName,
                role: 'publisher'
            }).subscribe(() => {

            }));
        }
    }

    sendMessage(e) {
        console.log(e);
        this.session.signal({
            data: e.message,  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: 'my-chat'             // The type of message (optional)
        })
            .then(() => {
                this.subscriptions.push(this.videoChatService.saveVideoMessage({video_id: this.videoId, ...e}).subscribe(dt => {
                    // console.log('Message successfully sent');
                    this.messages = dt;
                }));
            })
            .catch(error => {
                console.error(error);
            });
    }

    sendRecordingState(recording) {
        // console.log('recording!!!!')
        if (this.session) {
            this.session.signal({
                data: recording,  // Any string (optional)
                to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
                type: 'recording-state'             // The type of message (optional)
            }).then(() => {

            });
        }
    }

    receiveRecordingState() {
        this.session.on('signal:recording-state', (event: any) => {
            this.recordingState = !!event.data ? 'started' : 'finished';
            if (this.recordingState === 'finished') {
                this.tags = [];
            }

            this.subject.setVideoRecordingState({recordingState: this.recordingState, ...{viaSocket: true}});
        });
    }

    receiveMessage() {
        this.session.on('signal:my-chat', (event: any) => {
            // console.log(event.from)
            this.subject.setMsgData({message: event.data, from_user: event.from.data});
            // console.log(event.data); // Message
            // console.log(event.from); // Connection object of the sender
            // console.log(event.type); // The type of message ("my-chat")
        });
    }

    removeLiveVideoByToken() {
        this.videoService.removeVideoByToken({token: this.openViduToken}).subscribe(() => {
        });
    }

    reloadPage() {
        location.reload();
    }

    ngOnDestroy(): void {

        if (this.recordingState === 'started') {
            this.removeLiveVideoByToken();
        }

        // On component destroyed leave session
        this.leaveSession();

        this.subscriptions.forEach(s => s.unsubscribe());
    }

    openSocialShareModal() {
        console.log('modal');
        console.log(this.recordingState);
        if (this.recordingState === 'started') {
            this.dialog.open(SocialShareDialogComponent, {width: '500px', height: '400px', data: {shareUrl: this.shareUrl}})
                .afterClosed().subscribe(dt => {
            });
        }
        if (this.recordingState === 'finished') {
            const {hostName} = this.getUrlParts.transform(window.location.href);
            this.shareUrl = `${hostName}videos/play?id=${this.videoId}`;
            this.dialog.open(SocialShareDialogComponent, {width: '500px', height: '400px', data: {shareUrl: this.shareUrl}})
                .afterClosed().subscribe(dt => {
            });
        }
    }

    ngAfterViewInit() {
    }
}
