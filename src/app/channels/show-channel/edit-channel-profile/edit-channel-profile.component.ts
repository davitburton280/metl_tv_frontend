import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImgEditCropperComponent} from '@core/components/modals/img-edit-cropper/img-edit-cropper.component';
import {takeUntil} from 'rxjs/operators';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {VideoService} from '@core/services/video.service';

@Component({
    selector: 'app-edit-channel-profile',
    templateUrl: 'edit-channel-profile.component.html',
    styleUrls: ['edit-channel-profile.component.scss']
})

export class EditChannelProfileComponent implements OnInit, OnDestroy {
    private imageCoverFile;
    private imageAvatarFile;
    public coverShowImg = false;
    public avatarShowImg = false;
    public discardORSave = false;
    public _imgCoverSuccess;
    private _imgAvatarSuccess;
    public coverImgSrc;
    public avatarImgSrc;
    private _unsubscribe$ = new Subject<void>();

    constructor(
        private _route: ActivatedRoute,
        private dialog: MatDialog,
        private uploadFile: VideoService,
    ) {
    }

    ngOnInit(): void {
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

    ngOnDestroy(): void {
    }
}
