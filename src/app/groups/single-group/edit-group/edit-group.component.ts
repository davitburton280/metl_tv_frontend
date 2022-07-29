import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImgEditCropperComponent} from '@core/components/modals/img-edit-cropper/img-edit-cropper.component';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-edit-group',
    templateUrl: 'edit-group.component.html',
    styleUrls: ['edit-group.component.scss']
})

export class EditGroupComponent implements OnInit, OnDestroy {
    public imageCoverFile;
    public coverShowImg = false;
    public avatarShowImg = false;
    public coverImgSrc;
    public avatarImgSrc;
    public imageAvatarFile;
    private _unsubscribe$ = new Subject<void>();

    constructor(
        private dialog: MatDialog,
    ) {
    }

    ngOnDestroy(): void {
    }

    public editImage(event, shape) {
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
                        this.coverShowImg = true;
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.coverImgSrc = e.target.result.toString();
                        };
                        reader.readAsDataURL(this.imageCoverFile);
                    }
                }
            });
    }

    ngOnInit(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}
