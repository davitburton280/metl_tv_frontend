import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PostsRoutingModule} from './posts-routing.module';
import {ShowPostsComponent} from './show-posts/show-posts.component';
import {PostFormComponent} from '@app/posts/post-form/post-form.component';
import {SharedModule} from '@shared/shared.module';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import { SinglePostComponent } from './single-post/single-post.component';


@NgModule({
    declarations: [
        ShowPostsComponent,
        PostFormComponent,
        SinglePostComponent
    ],
    imports: [
        CommonModule,
        PostsRoutingModule,
        SharedModule,
        CKEditorModule
    ]
})
export class PostsModule {
}
