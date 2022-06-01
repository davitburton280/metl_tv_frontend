import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserStoreService} from '@core/services/stores/user-store.service';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router } from '@angular/router';
import {PostsService} from '@core/services/posts.service';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {Location} from '@angular/common';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import {CK_EDITOR_CONFIG} from '@core/constants/global';
import {SocketIoService} from '@core/services/socket-io.service';
import {PostsStoreService} from '@core/services/stores/posts-store.service';
import { VideoService } from '@core/services/video.service';
import { API_URL } from '@core/constants/global';

@Component({
    selector: 'app-post-form',
    templateUrl: './post-form.component.html',
    styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnDestroy {
    public postForm: FormGroup;
    authUser;
    public Editor = ClassicEditor;

    @Input() selectedGroup;
    @Output() formReady = new EventEmitter();

    public dataPosts = '';
    defaultSelect = 'Select a group';
    editPost;

    imageFile;
    title = 'Create a post';
    edit = false;
    fileEditor = null;
    apiUrl = API_URL;

    constructor(
        private fb: FormBuilder,
        public userStore: UserStoreService,
        public groupsStore: GroupsStoreService,
        private postsStore: PostsStoreService,
        private socketService: SocketIoService,
        private route: ActivatedRoute,
        private router: Router,
        private postsService: PostsService,
        private _location: Location,
        private uploadFile: VideoService
    ) {
    }

    ngOnInit(): void {
        const queryParams = this.route.snapshot.queryParams;
        this.authUser = this.userStore.authUser;
        this.Editor.defaultConfig = CK_EDITOR_CONFIG;

        // console.log(queryParams.group_id)
        this.initForm(queryParams);
        this.selectedGroup = this.groupsStore.groups.find(g => g.id === +queryParams.group_id);
        this.postsStore.editePost$.subscribe((post) => {
            this.editPost = post;
            console.log(this.editPost);
            if (post) {
                this.title = 'Edit Posts';
                this.edit = true;
                this.postForm.patchValue({
                    id: post.id,
                    description: post.description,
                    group_id: [post.group_id],
                    // cover_img: [post.cover_img]
                });
            }
        }).unsubscribe();

        this.postsStore.fileImg$.subscribe((file) => {
            this.fileEditor = file;
            console.log(this.fileEditor);
        });
    }

    // addPhoto(event) {
    //     console.log(event);
    //     this.imageFile = event.target.files[0];
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const url = e.target.result;
    //         this.dataPosts = this.dataPosts + `<figure class="image">\n' +
    //             '    <img src=${url} alt="Description of an image">\n' +
    //             '</figure>`;
    //     };
    //     reader.readAsDataURL(this.imageFile);
    // }

    // newData;
    chengCKEditor({editor}: ChangeEvent) {
        // const regex = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
        //
        // console.log(editor?.getData());
        // let data = editor?.getData();
        // const found = regex.test(data);
        // console.log(found);
        // data = data.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
        //     console.log('-----------------', capture);
        //     return '';
        // });
        //
        // if (this.newData !== data || found) {
        //     console.log(data);
        //     editor.setData(data);
        //     this.newData = data;
        //     console.log(editor?.getData());
        // }
        //
        // this.postForm.value.description = '';
        if (this.postForm.value.description.includes('img src="')) {

            // console.log(this.postForm.value);
        } else {
            this.fileEditor = null;
            // console.log(this.postForm.value);
        }

        // this.formReady.emit(this.postForm.value);
        // const domParser = new DOMParser();
        // const htmlElement = domParser.parseFromString(this.postForm.value.description, 'text/html');
        // const imgTag = htmlElement.getElementsByTagName('img');
        // // @ts-ignore
        // for (const img of imgTag) {
        //     console.log(img.src = 'aaa');
        // }
        //
        // console.log(htmlElement);
        // console.log(this.fileEditor);
        // console.log(this.postForm.value);
    }

    savePosts() {
        // console.log(this.postForm.value.description);
        if (!this.edit) {
            const fd = new FormData();
            fd.append('image', this.fileEditor);
            fd.append('belonging', 'post_img');
            fd.append('duration', '');
            this.uploadFile.uploadFile(fd, 'image').subscribe(dt => {
                if (dt) {
                    this.postForm.value.description = this.postForm.value.description
                        .replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
                        // console.log('-----------------', capture);
                        return '<img src="' + this.apiUrl + 'uploads/images/' + dt.path + '"/>';
                    });
                    this.savePost().then().catch(err => {
                        console.log(err);
                        this.uploadFile.deleteFile(dt.path, 'image').subscribe(res => console.log(res));
                    });
                }
            },
            err => {
                console.log(err);
            });
        } else {
            if (this.postForm.value.description.includes('img src="')) {
                const fd = new FormData();
                fd.append('image', this.fileEditor);
                fd.append('belonging', 'post_img');
                fd.append('duration', '');
                this.uploadFile.uploadFile(fd, 'image').subscribe((file) => {
                    // console.log(file);
                    this.postForm.value.description = this.postForm.value.description
                        .replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
                            // console.log('-----------------', capture);
                            return '<img src="' + this.apiUrl + 'uploads/images/' + file.path + '"/>';
                        });
                    const obj = {
                        id: this.editPost.id,
                        description: this.postForm.value.description,
                        group_id: this.postForm.value.group_id[0]
                    };
                    this.postsService.editPosts(obj).subscribe((dt) => {
                        console.log(dt);
                        this._location.back();
                    },
                        error => {
                            console.log(error);
                            this.uploadFile.deleteFile(file.path, 'image').subscribe(res => console.log(res));
                        });
                });
            } else {
                this.fileEditor = null;
                const obj = {
                    id: this.editPost.id,
                    description: this.postForm.value.description,
                    group_id: this.postForm.value.group_id[0],
                };
                this.postsService.editPosts(obj).subscribe((dt) => {
                    console.log(dt);
                    this._location.back();
                });
            }
        }
    }

    public onReady(editor) {
        console.log(editor);
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
        // editor.removePlugins.get('html5upload,flashupload').create();
        editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
            return new UploadAdapter(loader, editor.t, this.postsStore);
        };
    }

    initForm(queryParams) {
        this.postForm = this.fb.group({
            description: ['', Validators.required],
            username: [this.userStore.authUser.username],
            author_id: [this.userStore.authUser?.id],
            group_id: [queryParams.group_id || ''],
            votes: 1
        });
        console.log(this.postForm.value);
    }

    selectGroup(e) {
        console.log(e.target.value);
        this.selectedGroup = this.groupsStore.groups.find(g => g.id === +e.target.value);
    }

    async savePost() {
        if (this.postForm.valid && !this.edit) {
            console.log(this.postForm.value, this.selectedGroup);
            this.postsService.add(this.postForm.value).subscribe((dt) => {
                this.postsStore.setAllPosts(dt);
                this.socketService.postAdded({
                    from_user: this.authUser,
                    ...this.postForm.value,
                    group: this.selectedGroup,
                    msg: this.getPostNotificationText()
                });
                this._location.back();
                this.postForm.reset();
            });
        }
        if (this.postForm.valid && this.edit) {
            console.log(this.postForm.value);
        }
    }

    getPostNotificationText() {
        let msg = `<strong>${this.authUser.first_name} ${this.authUser.last_name}</strong> added a new post`;
        if (this.selectedGroup) {
            msg = `<strong>${this.authUser.first_name} ${this.authUser.last_name}</strong> posted in
                    <strong>${this.selectedGroup.name}</strong> group`;
        }

        return msg;
    }

    ngOnDestroy() {
        this.postsStore.setEditePost(null);
    }

}

export class UploadAdapter {
    private loader;
    private t;
    private postsStore;
    constructor(loader, t, postsStore) {
        this.loader = loader;
        this.t = t;
        this.postsStore = postsStore;
    }

    upload(loader, t) {
        console.log(loader);
        console.log(t);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // tslint:disable-next-line:only-arrow-functions
            reader.onload = function(): void {
                resolve({ default: reader.result });
            };

            // tslint:disable-next-line:only-arrow-functions
            reader.onerror = function(error) {
                reject(error);
            };

            this.loader.file.then(async (fl) => {
                reader.readAsDataURL(fl);
                await this.postsStore.setImageUpload(fl);
            });
        });
    }
}
