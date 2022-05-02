import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PostsService} from '@core/services/posts.service';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';
import {Location} from '@angular/common';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CK_EDITOR_CONFIG} from '@core/constants/global';
import {SocketIoService} from '@core/services/socket-io.service';
import {PostsStoreService} from '@core/services/stores/posts-store.service';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

@Component({
    selector: 'app-post-form',
    templateUrl: './post-form.component.html',
    styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
    postForm: FormGroup;
    authUser;
    Editor = ClassicEditor;

    @Input() selectedGroup;
    @Output() formReady = new EventEmitter();

    public dataPosts = '';

    constructor(
        private fb: FormBuilder,
        public userStore: UserStoreService,
        public groupsStore: GroupsStoreService,
        private postsStore: PostsStoreService,
        private socketService: SocketIoService,
        private route: ActivatedRoute,
        private router: Router,
        private postsService: PostsService,
        private _location: Location
    ) {
    }

    ngOnInit(): void {
        const queryParams = this.route.snapshot.queryParams;
        this.authUser = this.userStore.authUser;
        ClassicEditor.defaultConfig = CK_EDITOR_CONFIG;

        // console.log(queryParams.group_id)
        this.initForm(queryParams);
        this.selectedGroup = this.groupsStore.groups.find(g => g.id === +queryParams.group_id);
    }

    onChange({editor}: ChangeEvent) {
        // this.dataPosts = editor.getData();
        console.log( editor.getData() );
    }
    public onReady(editor) {
        console.log(editor);
    }

    initForm(queryParams) {
        this.postForm = this.fb.group({
            description: ['', Validators.required],
            username: [this.userStore.authUser.username],
            author_id: [this.userStore.authUser?.id],
            group_id: [queryParams.group_id || ''],
            votes: 1
        });
    }

    selectGroup(e) {
        console.log(e.target.value);
        this.selectedGroup = this.groupsStore.groups.find(g => g.id === +e.target.value);
    }

    async savePost() {
        // this.formReady.emit(this.postForm.value);

        if (this.postForm.valid) {
            console.log(this.postForm.value, this.selectedGroup)
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
    }

    getPostNotificationText() {
        let msg = `<strong>${this.authUser.first_name} ${this.authUser.last_name}</strong> added a new post`;
        if (this.selectedGroup) {
            msg = `<strong>${this.authUser.first_name} ${this.authUser.last_name}</strong> posted in
                    <strong>${this.selectedGroup.name}</strong> group`;
        }

        return msg;
    }

}
