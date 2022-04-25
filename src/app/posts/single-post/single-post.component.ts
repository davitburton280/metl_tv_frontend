import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PostsService} from '@core/services/posts.service';
import {Observable} from 'rxjs';
import {Post} from '@shared/models/post';
import {PostsStoreService} from '@core/services/stores/posts-store.service';

@Component({
    selector: 'app-single-post',
    templateUrl: './single-post.component.html',
    styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private postsService: PostsService,
        public postsStore: PostsStoreService
    ) {
    }

    ngOnInit(): void {
        this.getPostById();
    }

    getPostById() {
        const postId = this.route.snapshot.params.id;
        this.postsService.getById({id: postId});
    }

    vote(postData) {
        this.postsService.vote(postData);
    }

}
