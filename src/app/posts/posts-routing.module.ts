import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PostFormComponent} from '@app/posts/post-form/post-form.component';
import {ShowPostsComponent} from '@app/posts/show-posts/show-posts.component';
import {SinglePostComponent} from '@app/posts/single-post/single-post.component';


const routes: Routes = [
    {
        path: 'create',
        component: PostFormComponent
    },
    {
        path: 'news-feed',
        component: ShowPostsComponent,
        data: {
            title: 'News feed'
        }
    },
    {
        path: ':id',
        component: SinglePostComponent,
        data: {
            title: 'Post page'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostsRoutingModule {
}
