import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { API_URL } from '@core/constants/global';
import Cropper from 'cropperjs';
import { GetAuthUserPipe } from '@shared/pipes/get-auth-user.pipe';

@Component({
  selector: 'app-img-edit-cropper',
  templateUrl: './img-edit-cropper.component.html',
  styleUrls: ['./img-edit-cropper.component.scss']
})
export class ImgEditCropperComponent implements OnInit, AfterViewInit {

    title = '';

    imageSrc = '';
    cropperImage;
    authUser;
    @ViewChild('image', {static: false})
    public imageElement: ElementRef;
    private cropper: Cropper;
    file;



    public constructor(
        public dialogRef: MatDialogRef<ImgEditCropperComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private getAuthUser: GetAuthUserPipe,
    ) {

    }

    public ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.title = this.data.title;
        // this.imageSrc = API_URL + 'uploads/user_avatars/' + this.authUser.avatar;
        this.file = this.data.file;
        this.imgSrcFile(this.file);
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

    cropperImgLoad() {
        this.cropper = new Cropper(this.imageElement.nativeElement, {
            zoomable: false,
            scalable: false,
            viewMode: 2,
            aspectRatio: 400 / 400,
            crop: () => {
                const canvas = this.cropper.getCroppedCanvas();
                this.cropperImage = canvas.toDataURL('image/png');
                canvas.width = 400;
                canvas.height = 400;
                console.log(canvas);
            }
        });
    }

    saveCropperImg() {
       this.cropper.getCroppedCanvas({
           minWidth: 720,
           minHeight: 300,
           maxWidth: 720,
           maxHeight: 300,
       }).toBlob((blob) => {
           console.log(blob);
           this.dialogRef.close(blob);
       });
    }



    closedModal() {
        this.dialogRef.close();
    }

}
