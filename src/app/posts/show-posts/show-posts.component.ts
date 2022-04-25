import {Component, OnInit} from '@angular/core';
import {PostsService} from '@core/services/posts.service';
import trackByElement from '@core/helpers/track-by-element';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {PostsStoreService} from '@core/services/stores/posts-store.service';

@Component({
    selector: 'app-show-posts',
    templateUrl: './show-posts.component.html',
    styleUrls: ['./show-posts.component.scss']
})
export class ShowPostsComponent implements OnInit {
    posts = [];
    trackByElement = trackByElement;

    constructor(
        private postsService: PostsService,
        public postsStore: PostsStoreService,
        private userStore: UserStoreService
    ) {
    }

    ngOnInit(): void {
        this.getAllPosts();
    }

    getAllPosts() {

    }

    vote(postData) {
        this.postsService.vote(postData);
    }

}
