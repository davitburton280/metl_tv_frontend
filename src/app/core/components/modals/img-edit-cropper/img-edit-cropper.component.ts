import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import Cropper from 'cropperjs';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-img-edit-cropper',
    templateUrl: './img-edit-cropper.component.html',
    styleUrls: ['./img-edit-cropper.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ImgEditCropperComponent implements OnInit, AfterViewInit {

    title = '';

    imageSrc = '';
    cropperImage;
    authUser: CurrentUserData;
    @ViewChild('image', {static: false})
    public imageElement: ElementRef;
    private cropper: Cropper;
    file;
    shape;


    public constructor(
        public dialogRef: MatDialogRef<ImgEditCropperComponent>,
        private _userInfoService: UserInfoService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        // private getAuthUser: GetAuthUserPipe,
    ) {
        this.title = this.data.title;
        this.shape = this.data.shape;
        this.file = this.data.file;
        this._getAuthInfo();
    }

    public ngOnInit(): void {
        this.imgSrcFile(this.file);
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Img Edit cropper');
        });
    }

    imgSrcFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imageSrc = e.target.result.toString();
        };
        reader.readAsDataURL(file);
    }

    public ngAfterViewInit() {

    }

    loadImage() {
        if (this.shape === 'circle') {
            this.avatarImgLoad();
        }
        if (this.shape === 'square') {
            this.cropperImgLoad();
        }
    }

    cropperImgLoad() {
        this.cropper = new Cropper(this.imageElement.nativeElement, {
            zoomable: false,
            scalable: false,
            viewMode: 2,
            aspectRatio: 1200 / 300,
            crop: () => {
                const canvas = this.cropper.getCroppedCanvas();
                this.cropperImage = canvas.toDataURL('image/png');
            }
        });
    }

    avatarImgLoad() {
        this.cropper = new Cropper(this.imageElement.nativeElement, {
            zoomable: false,
            scalable: false,
            viewMode: 2,
            aspectRatio: 400 / 400,
            crop: () => {
                const canvas = this.cropper.getCroppedCanvas();
                this.cropperImage = canvas.toDataURL('image/png');
            }
        });
    }

    saveImg() {
        if (this.shape === 'circle') {
            this.saveAvatarImg();
        }
        if (this.shape === 'square') {
            this.saveCropperImg();
        }
    }

    saveCropperImg() {
        this.cropper.getCroppedCanvas({
            minWidth: 720,
            minHeight: 300,
            maxWidth: 720,
            maxHeight: 300,
        }).toBlob((blob) => {
            console.log(blob);
            this.dialogRef.close({blob, shape: 'square'});
        });
    }

    saveAvatarImg() {
        this.cropper.getCroppedCanvas({
            minWidth: 400,
            minHeight: 400,
            maxWidth: 400,
            maxHeight: 400,
        }).toBlob((blob) => {
            console.log(blob);
            blob['name'] = Date.now() + '.png';
            this.dialogRef.close({blob, shape: 'circle'});
        }, 'image/png');
    }


    closedModal() {
        this.dialogRef.close();
    }

}
