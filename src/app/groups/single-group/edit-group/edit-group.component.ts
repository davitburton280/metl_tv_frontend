import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImgEditCropperComponent} from '@core/components/modals/img-edit-cropper/img-edit-cropper.component';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GroupsService} from '@core/services/groups.service';
import {ActivatedRoute, Params} from '@angular/router';
import {EditGroupInterface} from '@app/groups/single-group/edit-group/interface';
import {VideoService} from '@core/services/video.service';

@Component({
    selector: 'app-edit-group',
    templateUrl: 'edit-group.component.html',
    styleUrls: ['edit-group.component.scss']
})

export class EditGroupComponent implements OnInit, OnDestroy {
    public editGroupForm: FormGroup | any;
    private imageCoverFile;
    private _groupId: number;
    private imageAvatarFile;
    public addDescriptionSectionShow = false;
    public coverShowImg = false;
    public avatarShowImg = false;
    public discardORSave = false;
    private _imgCoverSuccess;
    private _imgAvatarSuccess;
    public coverImgSrc;
    public avatarImgSrc;
    private _unsubscribe$ = new Subject<void>();
    private passedGroupName: string;

    constructor(
        private _fb: FormBuilder,
        private _groupsService: GroupsService,
        private _route: ActivatedRoute,
        private dialog: MatDialog,
        private uploadFile: VideoService,
    ) {
        this._route.params.subscribe((params: Params) => {
            this.passedGroupName = params.id;
        });
    }


    get coverImg(): any {
        return false;
    }

    ngOnInit(): void {
        this._formBuilder();
        this._patchInitialValueForm();
    }

    public addDescriptionHideShow(): void {
        this.addDescriptionSectionShow = !this.addDescriptionSectionShow;
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
                        this.discardORSave = !this.discardORSave;
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
                        this.discardORSave = !this.discardORSave;
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.avatarImgSrc = e.target.result.toString();
                        };
                        reader.readAsDataURL(this.imageAvatarFile);
                    }
                }
            });
    }

    private _formBuilder(): void {
        this.editGroupForm = this._fb.group({
            nameGroup: [null, Validators.required],
            privacy: [null, Validators.required],
            description: [null, Validators.required]
        });
    }

    private _patchInitialValueForm(): void {
        console.log(this.passedGroupName);
        this._groupsService.getGroupById(this.passedGroupName)
            .subscribe((data: EditGroupInterface) => {
                this._groupId = data?.id;
                if (data?.cover || data?.avatar) {
                    this.coverImgSrc = data?.cover;
                    this.avatarImgSrc = data?.avatar;
                    this.avatarShowImg = !Boolean(data?.avatar);
                    this.coverShowImg = !Boolean(data?.cover);
                }
                this.editGroupForm.patchValue({
                    nameGroup: data?.name,
                    privacy: data?.privacy,
                    description: data?.description
                });
                if (data?.description) {
                    this.addDescriptionSectionShow = true;
                }
            });
    }


    public updateGGroupInfo() {
        if (this.editGroupForm.invalid) {
            return;
        }
        const UPDATE_FORM_DATA_GROUP = {
            name: this.editGroupForm.get('nameGroup').value,
            description: this.editGroupForm.get('nameGroup').value,
            cover: this._imgCoverSuccess,
            avatar: this._imgAvatarSuccess,
            privacy: this.editGroupForm.get('privacy').value
        };
        this._groupsService.updateGroup(this._groupId, UPDATE_FORM_DATA_GROUP).subscribe((data) => {
            console.log(data, 'UPDATE_FORM_DATA_GROUP');
        });
        // console.log(UPDATE_FORM_DATA_GROUP, );
    }


    ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}
