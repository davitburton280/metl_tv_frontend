import {Component, Input, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {VideoService} from '@core/services/video.service';
import {PostsService} from '@core/services/posts.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PostsStoreService} from '@core/services/stores/posts-store.service';
import {MatDialog} from '@angular/material/dialog';
import {UploadFileComponent} from '@core/components/modals/upload-file/upload-file.component';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-post-form-placeholder',
    templateUrl: './post-form-placeholder.component.html',
    styleUrls: ['./post-form-placeholder.component.scss']
})
export class PostFormPlaceholderComponent implements OnInit {
    @Input() selectedGroup;

    authUser: CurrentUserData;
    fd = new FormData();
    videoUploadSpinner = false;
    finishVideoUpload = false;
    videoName = '';
    postForm: FormGroup;

    constructor(
        public userStore: UserStoreService,
        private postsServices: PostsService,
        private uploadFile: VideoService,
        private fb: FormBuilder,
        private postsStore: PostsStoreService,
        private dialog: MatDialog,
        private _userInfoService: UserInfoService
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Post Form  Placeholder DATA');
        });
    }

    addPhotoVideoPosts(fd, type) {
        this.uploadFile.uploadFile(fd, type).subscribe((res) => {
            if (res) {
                this.postForm = this.fb.group({
                    description: [''],
                    username: [this.userStore.authUser.username],
                    author_id: [this.userStore.authUser?.id],
                    group_id: [''],
                    cover_img: [res.path],
                    votes: 1
                });
                this.postsServices.add(this.postForm.value).subscribe((post) => {
                    console.log(post);
                    this.postsStore.setAllPosts(post);
                    this.postForm.reset();
                });
            }
            this.finishVideoUpload = false;
            this.fd = new FormData();
        });
    }

    uploadDialog() {
        this.dialog.open(UploadFileComponent, {
            maxWidth: '591px',
            maxHeight: '479px',
            height: '100%',
            width: '100%',
            data: {countUploadFile: 'oneFile'}
        }).afterClosed().subscribe(dt => {
            console.log(dt);
            if (dt) {
                const fd = new FormData();
                let type = '';
                dt.forEach((elem) => {
                    if (elem.type.includes('image')) {
                        console.log(elem);
                        type = 'image';
                        console.log(type);
                        fd.append('image', elem.file);
                        fd.append('belonging', 'post_image');
                        fd.append('duration', '');
                    }
                    if (elem.type.includes('video')) {
                        type = 'video';
                        console.log(type);
                        fd.append('video', elem.file);
                        fd.append('belonging', 'post_video');
                        fd.append('duration', elem.duration);
                    }
                });
                if (type === 'image' || type === 'video') {
                    this.addPhotoVideoPosts(fd, type);
                }
            }
        });
    }
}
