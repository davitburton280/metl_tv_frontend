import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';
import {Post} from '@shared/models/post';
import {BehaviorSubject, Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {PostsStoreService} from '@core/services/stores/posts-store.service';

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    pageSize;

    constructor(
        private http: HttpClient,
        private postsStore: PostsStoreService
    ) {
    }

    getGroupPosts(params) {
        return this.http.get<Post[]>(`${API_URL}posts/get`, {params});
    }

    getAllPosts(params) {
        return this.http.get<Post[]>(`${API_URL}posts/get`, {params})
            .pipe(shareReplay(1))
            .subscribe((posts: Post[]) => {
                this.postsStore.setAllPosts(posts);
            });
    }

    add(params) {
        return this.http.post<Post[]>(`${API_URL}posts/add`, params);
    }

    editPosts(obj) {
        const body = {
            group_id: obj.group_id,
            description: obj.description,
            cover_img: obj.cover_img
        };
        return this.http.put(`${API_URL}posts/edit?id=${obj.id}`, body);
    }

    getById(params) {
        return this.http.get<Post>(`${API_URL}posts/get-by-id`, {params})
            .subscribe((post: Post) => {
                this.postsStore.selectPost(post);
            });
    }

    vote(params) {
        return this.http.put(`${API_URL}posts/vote`, params)
            .pipe(shareReplay(1))
            .subscribe((data: any) => {
                console.log(data);
                this.postsStore.selectPost(data.posts.find(p => p.id === params.post_id));
                this.postsStore.setAllPosts(data);
            });
    }

    searchPost(params) {
        console.log(params);
        return this.http.get<Post[]>(`${API_URL}posts/news-feed`, { params });
    }

    delete(id: number[]) {
        const options = {body: {idList: id}};
        // @ts-ignore
        return this.http.delete(`${API_URL}posts/remove`,  options);
    }
}
