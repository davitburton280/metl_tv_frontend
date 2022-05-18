import {Component, Input, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';
import { VideoService } from '@core/services/video.service';
import { PostsService } from '@core/services/posts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsStoreService } from "@core/services/stores/posts-store.service";

@Component({
    selector: 'app-post-form-placeholder',
    templateUrl: './post-form-placeholder.component.html',
    styleUrls: ['./post-form-placeholder.component.scss']
})
export class PostFormPlaceholderComponent implements OnInit {
    @Input() selectedGroup;

    authUser;
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
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.userStore.authUser;
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

    videoUpload(event): any {
        this.videoUploadSpinner = true;
        const file = event.target.files[0];
        console.log(file.type);
        console.log(file.type.includes('video'));
        // tslint:disable-next-line:prefer-for-of
        if (file.type.includes('video')) {
            // tslint:disable-next-line:prefer-for-of
                const audio = new Audio();
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = e.target.result.toString().length;
                    const bytes = new ArrayBuffer(data);
                    audio.src = e.target.result.toString();
                    audio.addEventListener('loadedmetadata', () => {
                        console.log(audio.duration);
                        this.fd.append('video', file);
                        this.fd.append('belonging', 'post_video');
                        this.fd.append('duration', `${audio.duration}`);
                        this.videoUploadSpinner = false;
                        this.finishVideoUpload = true;
                        this.addPhotoVideoPosts(this.fd, 'video');
                    }, false);
                };
                reader.readAsDataURL(file);
        }
        console.log(file.type.includes('image'));
        if (file.type.includes('image')) {
            this.fd.append('image', file);
            this.fd.append('belonging', 'post_image');
            this.fd.append('duration', ``);
            this.videoUploadSpinner = false;
            this.finishVideoUpload = true;
            this.addPhotoVideoPosts(this.fd, 'image');
        }
    }
}
