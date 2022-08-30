import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImgEditCropperComponent} from '@core/components/modals/img-edit-cropper/img-edit-cropper.component';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {VideoService} from '@core/services/video.service';
import {ChannelsService} from '@core/services/channels.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-edit-channel-profile',
    templateUrl: 'edit-channel-profile.component.html',
    styleUrls: ['edit-channel-profile.component.scss']
})

export class EditChannelProfileComponent implements OnInit, OnDestroy {
    private _groupId: number | undefined;
    private imageCoverFile;
    private imageAvatarFile;
    public channelUpdateFormGroup: FormGroup | undefined;
    public coverShowImg = false;
    public avatarShowImg = false;
    public discardORSave = false;
    public _imgCoverSuccess;
    private _imgAvatarSuccess;
    public coverImgSrc;
    public avatarImgSrc;
    private _unsubscribe$ = new Subject<void>();

    constructor(
        private _fb: FormBuilder,
        private _route: ActivatedRoute,
        private dialog: MatDialog,
        private _channelService: ChannelsService,
        private uploadFile: VideoService,
    ) {
        this._route.params.subscribe((params: Params) => {
            this._groupId = params.id;
        });
    }

    ngOnInit(): void {
        this._formBuilder();
        this._fetchChannelDataById();
    }

    private _formBuilder() {
        this.channelUpdateFormGroup = this._fb.group({
            name: [null, Validators.required]
        });
    }

    private _fetchChannelDataById() {

        this._channelService.getChanelByID(this._groupId).subscribe(({data}: any) => {
            console.log(data);
            if (data?.cover || data?.avatar) {
                this.coverImgSrc = data?.cover;
                this._imgCoverSuccess = data?.cover;
                this.avatarImgSrc = data?.avatar;
                this.avatarShowImg = !Boolean(data?.avatar);
                this.coverShowImg = !Boolean(data?.cover);
            }
            this.channelUpdateFormGroup.patchValue({
                name: data?.name,
            });
        });
    }


    public remuveAvatarImage(avatar: string, cover: string) {
        this.avatarImgSrc = avatar;
        this.coverImgSrc = cover;
        this.discardORSave = false;
    }

    public createImage(event, shape) {
        const file = event.target.files[0];
        this.dialog.open(ImgEditCropperComponent, {
            maxWidth: '60vw',
            maxHeight: '70vh',
            height: '100%',
            width: '100%',
            data: {
                title: 'Profile Image Cropper',
                shape,
                file
            }
        }).afterClosed()
            .pipe(
                takeUntil(this._unsubscribe$),
            )
            .subscribe(dt => {
                console.log(dt);
                if (dt) {
                    if (dt.shape === 'square') {
                        this.imageCoverFile = dt.blob;
                        this.discardORSave = true;
                        this.coverShowImg = true;
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.coverImgSrc = e.target.result.toString();
                        };
                        reader.readAsDataURL(this.imageCoverFile);
                    }
                    if (dt.shape === 'circle') {
                        this.imageAvatarFile = dt.blob;
                        this.avatarShowImg = true;
                        this.discardORSave = true;
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.avatarImgSrc = e.target.result.toString();
                        };
                        reader.readAsDataURL(this.imageAvatarFile);
                    }
                }
            });
    }

    public saveAvatarImage(avatar: string, cover: string) {
        this.avatarImgSrc = avatar;
        this.coverImgSrc = cover;
        this.discardORSave = false;
        if (this.coverShowImg) {
            const fdCover = new FormData();
            fdCover.append('image', this.imageCoverFile);
            fdCover.append('belonging', 'group_cover_img');
            fdCover.append('duration', '');
            this.uploadFile.uploadFile(fdCover, 'image').subscribe((data) => {
                console.log(data);
                this.coverShowImg = false;
                this._imgCoverSuccess = data.path;
                this.coverImgSrc = data.path;
                console.log(this._imgCoverSuccess);
            });
        }
        if (this.avatarShowImg) {
            const fdAvatar = new FormData();
            fdAvatar.append('image', this.imageAvatarFile);
            fdAvatar.append('belonging', 'group_avatar_img');
            fdAvatar.append('duration', '');
            this.uploadFile.uploadFile(fdAvatar, 'image').subscribe((data) => {
                console.log(data);
                this.coverShowImg = false;
                this._imgAvatarSuccess = data.path;
                // this.coverImgSrc = data.path;
                console.log(this._imgAvatarSuccess);
            });
        }
    }


    public updateChannelInfo() {
        if (this.channelUpdateFormGroup.invalid) {
            return;
        }
        const UPDATE_FORM_DATA_GROUP = {
            name: this.channelUpdateFormGroup.get('name').value,
            cover: this._imgCoverSuccess,
            avatar: this._imgAvatarSuccess,
        };
        this._channelService.updateChannel(this._groupId, UPDATE_FORM_DATA_GROUP).subscribe((data) => {
            console.log(data, 'UPDATE_FORM_DATA_GROUP');
        });
        // console.log(UPDATE_FORM_DATA_GROUP, );
    }

    ngOnDestroy(): void {
    }
}
