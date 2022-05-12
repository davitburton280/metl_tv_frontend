import {Component, Input, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';
import { VideoService } from '@core/services/video.service';
import { PostsService } from "@core/services/posts.service";

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

    constructor(
        public userStore: UserStoreService,
        private postsServices: PostsService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.userStore.authUser;
    }

    addPhotoVideoPosts() {
        this.postsServices.add(this.fd).subscribe((posts) => {
            this.finishVideoUpload = false;
            this.videoName = '';
            console.log(posts);
        });
    }

    videoUpload(event): any {
        this.videoUploadSpinner = true;
        this.videoName = event.target.files[0].name;
        console.log(event.target.files[0].type.slice(0, 5));
        this.fd.append('userName', this.authUser.username);
        this.fd.append('group_id', '');
        this.fd.append('author_id', this.authUser.id);
        this.fd.append('description', '');
        this.fd.append('type', event.target.files[0].type.slice(0, 5));
        // tslint:disable-next-line:prefer-for-of
        if (event.target.files[0].type.slice(0, 5) === 'video') {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < event.target.files.length; i++) {
                const audio = new Audio();
                const reader = new FileReader();
                console.log(event.target.files[i]);
                reader.onload = (e) => {
                    const data = e.target.result.toString().length;
                    const bytes = new ArrayBuffer(data);
                    audio.src = e.target.result.toString();
                    audio.addEventListener('loadedmetadata', () => {
                        console.log(event.target.files[i], audio.duration);
                        this.fd.append('file', event.target.files[i]);
                        // this.fd.append('file_name', event.target.files[i].name);
                        const type = event.target.files[i].type.slice(0, 5);
                        console.log(type);
                        this.fd.append('video_duration', `${audio.duration}`);
                        this.videoUploadSpinner = false;
                        this.finishVideoUpload = true;
                        this.addPhotoVideoPosts();
                    }, false);
                };
                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }
}
