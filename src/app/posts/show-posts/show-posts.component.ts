import {Component, OnInit} from '@angular/core';
import {PostsService} from '@core/services/posts.service';
import trackByElement from '@core/helpers/track-by-element';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {PostsStoreService} from '@core/services/stores/posts-store.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {PageEvent} from '@angular/material/paginator';
import {STOCK_CATEGORIES} from '@core/constants/global';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-show-posts',
    templateUrl: './show-posts.component.html',
    styleUrls: ['./show-posts.component.scss']
})
export class ShowPostsComponent implements OnInit {
    posts = [];
    trackByElement = trackByElement;
    authUser: CurrentUserData;
    allPost: any[];

    // Pagination

    paginatorLength;
    paginatorPageSize = 10;
    perPage = 1;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    sortingOptions = '';
    category = STOCK_CATEGORIES;
    categoryName = 'Category';
    search = '';

    // /////////////////////////////// //

    constructor(
        private postsService: PostsService,
        public postsStore: PostsStoreService,
        private _userInfoService: UserInfoService
        // private userStore: UserStoreService
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
        this.postsStore.allPosts$.subscribe((data: any) => {
            this.allPost = data.posts;
            this.paginatorLength = data.totalCount;
        });
        // this.authUser = this.userStore.authUser;
        this.getAllPosts().then();
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Show posts  AUTHUSER DATA');
        });
    }

    pagination(e) {
        this.perPage = e.pageIndex + 1;
        this.paginatorPageSize = e.pageSize;
        this.getAllPosts().then();
    }

    async getAllPosts() {
        const params = {
            user_id: this.authUser?.id,
            offset: this.perPage,
            limit: this.paginatorPageSize,
            sorting_keyword: this.sortingOptions,
            search: this.search
        };
        await this.postsService.getAllPosts(params);
    }

    sortPosts(sort) {
        if (this.sortingOptions === sort) {
            this.sortingOptions = '';
        } else {
            this.sortingOptions = sort;
        }
        this.getAllPosts().then();
    }

    selectCategory(stock) {
        this.categoryName = stock.name;
        this.sortPosts(stock.value);
    }

    delete() {
        if ((this.paginatorLength - 1) % this.paginatorPageSize === 0) {
            this.perPage -= 1;
        }
        if (this.perPage <= 1) {
            this.perPage = 1;
        }
        this.getAllPosts().then();
    }

    vote(postData) {
        this.postsService.vote(postData);
    }

    searchPost(value) {
        const params = {
            offset: this.perPage,
            limit: this.paginatorPageSize,
            sorting_keyword: this.sortingOptions,
            search: this.search
        };
        this.postsService.searchPost(params).subscribe((data: any) => {
            this.allPost = data.posts;
            this.paginatorLength = data.totalCount;
            console.log(data);
        });
    }

    searchInput(e) {
        this.search = e.target.value;
    }

}
