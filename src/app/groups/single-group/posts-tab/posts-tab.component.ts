import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '@core/services/posts.service';
import {Observable, Subscription} from 'rxjs';
import {Post} from '@shared/models/post';
import trackByElement from '@core/helpers/track-by-element';

@Component({
    selector: 'app-posts-tab',
    templateUrl: './posts-tab.component.html',
    styleUrls: ['./posts-tab.component.scss']
})
export class PostsTabComponent implements OnInit {

    @Input() selectedGroup;
    @Input() isOwnGroup;
    groupPosts$: Observable<Post[]>;


    trackByElement = trackByElement;

    constructor(
        private postsService: PostsService,
    ) {
    }

    ngOnInit(): void {
        this.getGroupPosts();
    }

    getGroupPosts() {
        this.groupPosts$ = this.postsService.getGroupPosts({group_id: this.selectedGroup.id});
    }


}
