import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from '@shared/models/post';
import {PostsService} from '@core/services/posts.service';
import {UserStoreService} from '@core/services/stores/user-store.service';
import { SocialShareDialogComponent } from '@core/components/modals/social-share-dialog/social-share-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import { PostsStoreService } from "@core/services/stores/posts-store.service";

@Component({
    selector: 'app-post-item',
    templateUrl: './post-item.component.html',
    styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
    @Input() post: Post;
    @Input() group;
    @Input() accessedFromGroup = false;
    @Output() vote = new EventEmitter();

    selectedPost: Post;
    authUser;
    allPosts;

    constructor(
        private postsService: PostsService,
        private userStore: UserStoreService,
        private dialog: MatDialog,
        private postsStore: PostsStoreService
    ) {
    }

    ngOnInit(): void {
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
            return usersPosts.liked === vote &&
                usersPosts.user_id === this.authUser.id;
        });
    }

    deletePost(post) {
        const id = [];
        id.push(post.id);
        this.postsService.delete(id).subscribe((e) => {
            console.log(e);
            console.log(post);
            console.log(this.allPosts);
            this.allPosts = this.allPosts.filter(data => data.id !== post.id);
            console.log(this.allPosts);
            this.postsStore.setAllPosts(this.allPosts);
        });
    }

    editPost(post) {
        console.log(post);
    }

}
