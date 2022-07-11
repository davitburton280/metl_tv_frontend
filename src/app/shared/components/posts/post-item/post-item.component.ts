import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {Post} from '@shared/models/post';
import {PostsService} from '@core/services/posts.service';
import {UserStoreService} from '@core/services/stores/user-store.service';
import { SocialShareDialogComponent } from '@core/components/modals/social-share-dialog/social-share-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PostsStoreService } from '@core/services/stores/posts-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import {API_URL} from '@core/constants/global';
import { UploadFileComponent } from '@core/components/modals/upload-file/upload-file.component';

@Component({
    selector: 'app-post-item',
    templateUrl: './post-item.component.html',
    styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit, OnDestroy {
    @Input() post: Post;
    @Input() group;
    @Input() accessedFromGroup = false;
    @Output() vote = new EventEmitter();
    @Output() deletePosts = new EventEmitter();

    selectedPost: Post;
    authUser;
    allPosts;
    totalCount;
    API_URL = API_URL;
    commentsField;

    constructor(
        private postsService: PostsService,
        private userStore: UserStoreService,
        private dialog: MatDialog,
        private postsStore: PostsStoreService,
        public router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.commentsField = !!this.route.snapshot?.params?.id;
        // console.log(this.route.snapshot?.params?.id);
        this.authUser = this.userStore.authUser;
        this.postsStore.allPosts$.subscribe((data: any) => {
            this.allPosts = data.posts;
        });
    }
    openSocialShareModal() {
        this.dialog.open(SocialShareDialogComponent, {
            width: '500px',
            height: '400px',
            data: {shareUrl: window.location.href}
        })
            .afterClosed().subscribe(dt => {
        });
    }

    voteForPost(vote, post) {
        if (!this.isPostVotedByAuthUser(vote)) {
            this.selectedPost = post;
            this.vote.emit({
                post_id: this.post.id,
                user_id: this.authUser.id,
                post,
                vote
            });
        }
    }

    isPostVotedByAuthUser(vote) {
        return !!this.post?.user_posts?.find(up => {
            const usersPosts = up.users_posts;
            return usersPosts.voted === vote &&
                usersPosts.user_id === this.authUser.id;
        });
    }

    deletePost(post) {
        const id = [];
        id.push(post.id);
        this.postsService.delete(id).subscribe((e) => {
            this.deletePosts.emit();
        });
    }

    editPost(post) {
        console.log(post);
        this.postsStore.setEditePost(post);
        if (post.cover_img) {
            this.dialog.open(UploadFileComponent, {
                maxWidth: '591px',
                maxHeight: '479px',
                height: '100%',
                width: '100%',
                data: {
                    countUploadFile: 'oneFile',
                    post
                }
            }).afterClosed().subscribe(dt => {
                console.log(dt);
            });
        } else {
            this.router.navigate(['/posts/create']);
        }
    }

    ngOnDestroy() {

    }

}
