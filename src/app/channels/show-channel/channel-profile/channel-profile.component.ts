import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {UsersService} from '@core/services/users.service';
import {Base64ToFilePipe} from '@shared/pipes/base64-to-file.pipe';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ChannelsService} from '@core/services/channels.service';
import {SubjectService} from '@core/services/subject.service';
import {LoaderService} from '@core/services/loader.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {SocketIoService} from '@core/services/socket-io.service';
import {NotificationsSubjectStoreService} from '@core/services/stores/notifications-subject-store.service';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {Router} from '@angular/router';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {VideoService} from '@core/services/video.service';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-channel-profile',
    templateUrl: './channel-profile.component.html',
    styleUrls: ['./channel-profile.component.scss']
})
export class ChannelProfileComponent implements OnInit, OnDestroy {
    apiUrl = API_URL;

    profileChangedEvent: any;
    coverChangedEvent: any;

    subscribedToChannel = false;
    subscribersCount = 0;

    changingImage = false;
    editMode = false;

    channelForm: FormGroup;
    subscriptions: Subscription[] = [];

    usersConnectionStatus = 'idle';

    usersConnection;

    srcCoverImg;
    srcEditCoverImg;
    showHidEditCoverImg = false;
    fdCover = new FormData();
    srcAvatarImg;
    srcEditAvatarImg;
    showHidEditAvatarImg = false;
    fdAvatar = new FormData();


    @Input() channelUser;
    @Input() authUser;

    constructor(
        private usersService: UsersService,
        private userStore: UserStoreService,
        private base64ToFile: Base64ToFilePipe,
        // private getAuthUser: GetAuthUserPipe,
        private channelService: ChannelsService,
        private subject: SubjectService,
        private usersConnectionsStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private notificationsStore: NotificationsSubjectStoreService,
        private socketService: SocketIoService,
        public loader: LoaderService,
        private fb: FormBuilder,
        private uploadFile: VideoService,
        private _userInfoService: UserInfoService
    ) {
        this._getAuthInfo();

    }

    ngOnInit(): void {
        // console.log(this.authUser);
        if (this.channelUser) {
            this.initChannelForm();
            this.checkChannelSubscription();
            this.srcCoverImg = this.channelUser.channel.cover;
            this.srcAvatarImg = this.channelUser.channel.avatar;
        }
        this.socketService.getSubscribeChanel().subscribe(dt => {
            console.log(dt);
        });
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Chanel Profile  AUTHUSER DATA');
        });
    }

    initChannelForm() {
        this.channelForm = this.fb.group({
            id: [''],
            avatar: [''],
            cover: [''],
            name: ['', Validators.required],
            username: ['']
        });

        this.channelForm.patchValue({
            name: this.channelUser.channel.name,
            id: this.channelUser.channel.id,
            username: this.channelUser.username,
            avatar: this.channelUser.channel.avatar,
            cover: this.channelUser.channel.cover
        });
    }

    checkChannelSubscription() {
        this.subscriptions.push(this.channelService.checkChannelSubscription({
            user_id: this.authUser.id,
            channel_id: this.channelUser.channel.id
        }).subscribe(dt => {
            this.subscribedToChannel = dt.status === 'Subscribed';
            this.subscribersCount = dt.subscribers_count;
        }));
    }

    coverChangeEvent(event: any) {
        // console.log('++++++++');
        // console.log(event);
        this.coverChangedEvent = event;
        this.fdCover = new FormData();
        const reader = new FileReader();
        reader.onload = (ev) => {
            this.srcEditCoverImg = ev.target.result;
            this.showHidEditCoverImg = true;
        };
        reader.readAsDataURL(event.target.files[0]);
        this.fdCover.append('image', event.target.files[0]);
        this.fdCover.append('belonging', 'chanel_cover_img');
        this.fdCover.append('duration', '');
    }

    profileChangeEvent(event: any) {
        this.profileChangedEvent = event;
        this.fdAvatar = new FormData();
        const reader = new FileReader();
        reader.onload = (ev) => {
            this.srcEditAvatarImg = ev.target.result;
            this.showHidEditAvatarImg = true;
        };
        reader.readAsDataURL(event.target.files[0]);
        this.fdAvatar.append('image', event.target.files[0]);
        this.fdAvatar.append('belonging', 'chanel_avatar_img');
        this.fdAvatar.append('duration', '');
    }

    detectImageChange() {
        if (this.profileChangedEvent || this.coverChangedEvent) {
            this.loader.dataLoading = false;
            this.changingImage = false;
            this.showHidEditCoverImg = false;
            this.showHidEditAvatarImg = false;
            // console.log('Avatar changed');
            // console.log(this.changingImage);
        }
    }

    removeCover() {
        console.log(this.channelUser);
        this.srcEditCoverImg = '';
        this.srcEditAvatarImg = '';
        this.fdCover = new FormData();
        this.fdAvatar = new FormData();
        this.srcCoverImg = '';
        this.srcAvatarImg = '';
        this.detectImageChange();
        this.coverChangedEvent = null;
        this.profileChangedEvent = null;
        this.showHidEditAvatarImg = false;
    }

    removeAvatar() {
        // this.channelUser.channel.avatar = '';
        // this.srcCoverImg = this.channelUser.channel.cover;
        this.srcAvatarImg = '';
        this.srcAvatarImg = '';
        this.channelForm.patchValue({avatar: this.channelUser.channel.avatar});
    }

    subscribeToChannel(user): void {
        // this.connectWithUser(user);
        this.subscriptions.push(this.channelService.subscribeToChannel({
            user_id: this.authUser.id,
            channel_id: user.channel.id
        }).subscribe(dt => {
            console.log(dt);
            this.subscribedToChannel = dt.status === 'Subscribed';
            this.subscribersCount = dt.subscribers_count;
            this.subscriptions.push(this.channelService.getUserChannelSubscriptions({user_id: this.authUser.id}).subscribe(d => {
                this.subject.setUserSubscriptions(d);
            }));
            this.socketService.subscribeChanel({
                from_user: user,
                to_user: this.authUser,
                msg: `You have successfully subscribed to Gold Subscription for ${user.username}'s channel!`
            });
        }));
    }

    connectWithUser(user) {
        // this.usersConnectionStatus = 'connected';
        this.socketService.subscribeChanel({
            from_user: this.authUser,
            to_user: user,
            msg: `<strong>${this.authUser.username}</strong>
                just subscribed to your Gold Subscription tier!`
        });
        const notifications = this.notificationsStore.allNotifications.filter(n => n._id !== user.id);
        console.log(notifications);
        this.notificationsStore.setInitialNotifications(notifications);
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        this.showHidEditCoverImg = false;
        this.srcCoverImg = this.channelUser.channel.cover;
        this.coverChangedEvent = null;
    }

    saveChanges() {
        console.log('save changes!!!');
        console.log(this.channelForm.value);
        console.log('save changes!!!');

        if (this.channelForm.valid) {
            this.loader.dataLoading = true;
            if (this.coverChangedEvent) {
                this.uploadFile.uploadFile(this.fdCover, 'image').subscribe(dt => {
                    this.channelForm.patchValue({
                        cover: dt.path
                    });
                    console.log(this.channelForm.value);
                    this.subscriptions.push(this.channelService.changeChannelDetails(this.channelForm.value).subscribe((data => {
                        this.editMode = false;
                        this.changeAuthUserInfo(data);
                    })));
                });
            }

            if (this.profileChangedEvent) {
                this.uploadFile.uploadFile(this.fdAvatar, 'image').subscribe(dat => {
                    this.channelForm.patchValue({
                        avatar: dat.path
                    });
                    console.log(this.channelForm.value);
                    this.subscriptions.push(this.channelService.changeChannelDetails(this.channelForm.value).subscribe((data => {
                        this.editMode = false;
                        this.changeAuthUserInfo(data);
                    })));
                });
            }

            if (!this.profileChangedEvent && !this.coverChangedEvent) {
                console.log(this.channelForm.value);
                this.subscriptions.push(this.channelService.changeChannelDetails(this.channelForm.value).subscribe((data => {
                    this.editMode = false;
                    this.changeAuthUserInfo(data);
                })));
            }
        }
    }


    changeAuthUserInfo(dt) {
        localStorage.setItem('token', dt.token);
        // this.authUser = this.getAuthUser.transform();
        this.channelUser = this.authUser;
        this.changingImage = false;

        const token = dt.hasOwnProperty('token') ? dt?.token : '';
        if (token) {
            localStorage.setItem('token', token);
            this.userStore.setAuthUser(token);
        }


        // this.loader.dataLoading = false;
        // console.log(this.channelUser)
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
