import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Post} from '@shared/models/post';
import {UserStoreService} from '@core/services/stores/user-store.service';

@Injectable({
    providedIn: 'root'
})
export class PostsStoreService {
    private fileImg = new BehaviorSubject(null);
    fileImg$ = this.fileImg.asObservable();
    private editePost = new BehaviorSubject(null);
    editePost$ = this.editePost.asObservable();
    private allPostsSource = new BehaviorSubject([]);
    allPosts$ = this.allPostsSource.asObservable();

    private userPostsSource = new BehaviorSubject([]);
    userPosts$ = this.userPostsSource.asObservable();

    private selectedPostSource = new BehaviorSubject(null);
    selectedPost$ = this.selectedPostSource.asObservable();

    get allPosts() {
        return this.allPostsSource.getValue();
    }

    get selectedPost() {
        return this.selectedPostSource.getValue() as any;
    }


    constructor(
        private userStore: UserStoreService
    ) {
    }

    setAllPosts(posts: Post[]) {
        this.allPostsSource.next(posts);
    }

    setEditePost(post) {
        this.editePost.next(post);
    }
    setImageUpload(file) {
        this.fileImg.next(file);
    }

    vote() {

    }

    changePost(post: Post) {
        const allPosts = [...this.allPosts];
        // console.log(allPosts, this.allPosts, post)
        let selectedGroupIndex = allPosts.findIndex(gm => {
            return gm.id === post?.id;
        });

        if (selectedGroupIndex === -1) {
            selectedGroupIndex = allPosts.length;
        }

        allPosts[selectedGroupIndex] = post;
        console.log(allPosts, this.allPosts)
        this.setAllPosts(allPosts);
        if (post.id === this.selectedPost.id) {
            this.selectPost(post);
        }
    }

    selectPost(post) {
        this.selectedPostSource.next(post);
    }
}
