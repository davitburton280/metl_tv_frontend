import {Component, OnDestroy, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {Router} from '@angular/router';
import {UsersService} from '@core/services/users.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {patternValidator} from '@core/helpers/pattern-validator';
import {EMAIL_PATTERN, NUMBER_AFTER_TEXT_PATTERN, TEXT_ONLY_PATTERN_WITHOUT_SPECIALS} from '@core/constants/patterns';
import {LoaderService} from '@core/services/loader.service';
import {DROPZONE_CONFIG} from 'ngx-dropzone-wrapper';
import {AuthService} from '@core/services/auth.service';
import * as  moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {MatDialog} from '@angular/material/dialog';
import {ImgEditCropperComponent} from '@core/components/modals/img-edit-cropper/img-edit-cropper.component';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile-form.component.html',
    styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit, OnDestroy {
    profileForm: FormGroup;
    isSubmitted = false;
    subscriptions: Subscription[] = [];
    currentDate = new Date();
    maxDate: Date;

    dropzoneConfig = DROPZONE_CONFIG;
    dropzoneFiles = [];

    authUser;
    coverFile = [];

    imageCoverChangedEvent: any;
    imageAvatarChangedEvent: any;
    imageCoverFile;
    imageAvatarFile;
    coverShowImg = false;
    avatarShowImg = false;
    coverImgSrc;
    avatarImgSrc;


    constructor(
        private fb: FormBuilder,
        public loader: LoaderService,
        public auth: AuthService,
        private usersService: UsersService,
        private _userInfoService: UserInfoService,
        private toastr: ToastrService,
        private userStore: UserStoreService,
        public router: Router,
        private dialog: MatDialog,
        private uploadFile: VideoService
    ) {

        this._getUserInfo();
        //TODO this.getAuthUser func changed to usersService func
    }

    initForm() {
        this.profileForm = this.fb.group({
            id: [''],
            first_name: [{value: '', disabled: true}, [Validators.required, patternValidator(TEXT_ONLY_PATTERN_WITHOUT_SPECIALS)]],
            last_name: [{value: '', disabled: true}, [Validators.required, patternValidator(TEXT_ONLY_PATTERN_WITHOUT_SPECIALS)]],
            username: ['', [Validators.required, patternValidator(NUMBER_AFTER_TEXT_PATTERN)]],
            email: ['', [Validators.required, patternValidator(EMAIL_PATTERN)]],
            birthday: [''],
            // avatar: [''],
        });
    }


    ngOnInit(): void {
        this.initForm();
        this.profileForm.patchValue({...this.authUser, birthday: moment(this.authUser.birthday).format('MM/DD/YYYY')});
    }

    dateChanged(e) {

    }

    private _getUserInfo() {
        // this._userInfoService._getCurrentUserInfo();
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser);
        });
    }

    editImage(event, shape) {
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
        }).afterClosed().subscribe(dt => {
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
                if (dt.shape === 'circle') {
                    this.imageAvatarFile = dt.blob;
                    this.avatarShowImg = true;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.avatarImgSrc = e.target.result.toString();
                    };
                    reader.readAsDataURL(this.imageAvatarFile);
                }
            }
        });
        // this.authUser.avatar = '';
        // this.profileForm.patchValue({avatar: ''});
    }

    onAddedFile(e) {
        this.dropzoneFiles.push(e[0]);
        this.profileForm.patchValue({avatar: e[0].name});
        console.log(e);
    }

    addCoverImg(e) {
        this.coverFile.push(e.target.files[0]);
        this.profileForm.patchValue({cover: e.target.files[0].name});
    }

    buildFormData() {
        const formData: FormData = new FormData();
        const formValue = this.profileForm.value;
        const dropFileExist = Object.entries(this.dropzoneFiles).length > 0;
        const coverFileExist = Object.entries(this.coverFile).length > 0;

        for (const field in this.profileForm.value) {
            if (field === 'birthday') {
                if (formValue.birthday) {
                    formData.append(field, moment(new Date(this.profileForm.value[field])).format('YYYY-MM-DD'));
                }
            } else if (field !== 'avatar' || !dropFileExist) {
                formData.append(field, this.profileForm.value[field]);
            }
        }

        // If drop zone file exists saving it to formData object as well
        if (dropFileExist) {

            const file = this.dropzoneFiles[0];

            const fileName = `avatar_${Date.now()}.jpg`;
            formData.append('avatar', fileName);
            formData.append('user_avatar_file', file, fileName);
        }
        // if (coverFileExist) {
        //     const cover = this.coverFile[0];
        //     const fileName = `cover_${Date.now()}.jpg`;
        //     formData.append('cover', fileName);
        //     // formData.append('cover_avatar_file', cover, fileName);
        // }

        return formData;
    }

    async saveChanges() {
        console.log('++++++++');
        if (this.coverShowImg) {
            const fdCover = new FormData();
            fdCover.append('image', this.imageCoverFile);
            fdCover.append('belonging', 'profile_cover_img');
            fdCover.append('duration', '');
            await this.uploadFile.uploadFile(fdCover, 'image').subscribe((data) => {
                console.log(data);
                this.coverShowImg = false;
                this.saveEditeProfile('cover', data.path);
            });
        }
        if (this.avatarShowImg) {
            const fdAvatar = new FormData();
            fdAvatar.append('image', this.imageAvatarFile);
            fdAvatar.append('belonging', 'profile_avatar_img');
            fdAvatar.append('duration', '');
            await this.uploadFile.uploadFile(fdAvatar, 'image').subscribe((data) => {
                console.log(data);
                this.coverShowImg = false;
                this.saveEditeProfile('avatar', data.path);
            });
        }
        if (!this.avatarShowImg && !this.coverShowImg) {
            this.saveEditeProfile();
        }

        // const source = of(
        //     [
        //         this.uploadFile.uploadFile(fdCover, 'image'),
        //         this.uploadFile.uploadFile(fdAvatar, 'image'),
        //         this.usersService.saveProfileChanges(formData)
        //     ]);
        // const arrPosts = source.pipe(concatAll());
        // arrPosts.subscribe(data => {
        //     console.log(data);
        // },
        //     error => console.log(error));
    }

    saveEditeProfile(key?, value?) {
        const formData = this.buildFormData();
        if (key && value) {
            formData.append(key, value);
        }
        this.usersService.saveProfileChanges(formData).subscribe(async (dt) => {
            console.log(dt);
            const token = dt.hasOwnProperty('token') ? dt?.token : '';
            if (token) {
                localStorage.setItem('token', token);
                this.userStore.setAuthUser(token);
                this.toastr.success('The changes are saved successfully');
                await this.router.navigateByUrl('users/' + this.profileForm.value.username);
            }
        });
    }

    get firstName(): AbstractControl {
        return this.profileForm.get('first_name');
    }

    get lastName(): AbstractControl {
        return this.profileForm.get('last_name');
    }

    get email(): AbstractControl {
        return this.profileForm.get('email');
    }

    get pass(): AbstractControl {
        return this.profileForm.get('password');
    }

    get username(): AbstractControl {
        return this.profileForm.get('username');
    }

    get confirmPass(): AbstractControl {
        return this.profileForm.get('confirm_password');
    }

    get birthday(): AbstractControl {
        return this.profileForm.get('birthday');
    }

    get profileImg(): any {
        return this.authUser ? this.authUser.avatar : false;
    }

    get coverImg(): any {
        return this.authUser ? this.authUser.cover : false;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
