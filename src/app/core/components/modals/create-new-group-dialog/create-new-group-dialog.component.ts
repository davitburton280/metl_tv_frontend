import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {User} from '@shared/models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SocketIoService} from '@core/services/socket-io.service';
import {Subject, Subscription} from 'rxjs';
import {LowercaseRemoveSpacesPipe} from '@shared/pipes/lowercase-remove-spaces.pipe';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {GroupsService} from '@core/services/groups.service';
import {ImgEditCropperComponent} from '@core/components/modals/img-edit-cropper/img-edit-cropper.component';
import {takeUntil} from 'rxjs/operators';
import {InviteChannelComponent} from '@core/components/modals/create-new-group-dialog/invite-chanel';
import {UserInfoService} from '@core/services/user-info.service';
import {VideoService} from '@core/services/video.service';

@Component({
    selector: 'app-create-new-group-dialog',
    templateUrl: './create-new-group-dialog.component.html',
    styleUrls: ['./create-new-group-dialog.component.scss']
})
export class CreateNewGroupDialogComponent implements OnInit {
    @ViewChild('text') text: ElementRef;
    private _wordCount: any;
    public words = 0;
    public groupForm: FormGroup;
    public addDescriptionSectionShow = false;
    public step = 1;
    public coverShowImg = false;
    public avatarShowImg = false;
    public discardORSave = false;
    public coverImgSrc;
    public avatarImgSrc;
    private imageCoverFile;
    private imageAvatarFile;
    private _unsubscribe$ = new Subject<void>();
    public _imgCoverSuccess;
    private _imgAvatarSuccess;
    subscriptions: Subscription[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public authUser: User,
        private fb: FormBuilder,
        private _dialog: MatDialog,
        private _userInfoService: UserInfoService,
        private dialog: MatDialogRef<CreateNewGroupDialogComponent>,
        private groupsService: GroupsService,
        private socketService: SocketIoService,
        private groupsStore: GroupsStoreService,
        private uploadFile: VideoService,
        private lowerCaseRemoveSpaces: LowercaseRemoveSpacesPipe
    ) {
        // console.log(this.authUser,"HRach");
    }

    // tslint:disable-next-line:ban-types
    get coverImg(): Boolean {
        return false;
    }

    // tslint:disable-next-line:ban-types
    get profileImg(): Boolean {
        return false;
    }

    ngOnInit(): void {
        this._initForm();
    }

    private _initForm() {
        this.groupForm = this.fb.group({
            name: ['', Validators.required],
            custom_name: ['', Validators.required],
            privacy: [0, Validators.required],
            description: ['', Validators.required],
            creator_id: this.authUser.id,
            username: this.authUser.username
        });
    }

    public addDescriptionHideShow(): void {
        this.addDescriptionSectionShow = !this.addDescriptionSectionShow;
    }

    public backStep(): void {
        this.step = 1;
    }

    public createImage(event, shape) {
        const file = event.target.files[0];
        this._dialog.open(ImgEditCropperComponent, {
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
                        this.discardORSave = true;
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

    public inviteChanelMembersDialog() {
        this._dialog.open(InviteChannelComponent, {
            height: '600px',
            width: '400px',
            // data: {
            //     title: 'Profile Image Cropper',
            //     shape,
            //     file
            // }
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
                console.log(this._imgAvatarSuccess);
            });
        }
    }

    public remuveAvatarImage(avatar: string, cover: string) {
        this.avatarImgSrc = avatar;
        this.coverImgSrc = cover;
        this.discardORSave = false;
    }

    public _validatorDescription() {
        this._wordCount = this.text ? this.text.nativeElement.value.split(/\s+/) : 0;

        switch (this._wordCount) {
            case this._wordCount.includes('a'):
                this.words = this._wordCount ? this._wordCount.length - 1 : 0;
                break;
            case this._wordCount.includes('the'):
                this.words = this._wordCount ? this._wordCount.length - 1 : 0;
                break;
            case this._wordCount.includes('an'):
                this.words = this._wordCount ? this._wordCount.length - 1 : 0;
                break;
            default:
                this.words = this._wordCount ? this._wordCount.length : 0;
            // code block
        }

        console.log(this.words);
        this.words = 0;
    }

    public submitForm(): void {
        this.step++;
        this.groupForm.patchValue({custom_name: this.lowerCaseRemoveSpaces.transform(this.groupForm.value.name)});
        if (this.groupForm.valid && this.step === 3) {
            console.log(this._imgAvatarSuccess, this._imgCoverSuccess, 'Images');
            const formValue = {
                ...this.groupForm.value,
                avatar: this._imgAvatarSuccess,
                cover: this._imgCoverSuccess,
            };
            this.groupsService.addGroup(formValue);
        // .subscribe(async (dt) => {
        //         console.log(dt,"hrach");
        //         const selectedGroup = dt.find(d => formValue.name === d.name);
        //         this.groupsStore.setGroups(dt);
        //         this.groupsStore.selectGroup(selectedGroup);
        //         this.socketService.setNewPageGroup(formValue);
        //
        //
        //     });
            this.dialog.close(this.groupForm.value);
            this.step = 1;
        }
    }

    closeDialog() {
        this.dialog.close(null);
    }

}
