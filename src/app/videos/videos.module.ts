import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VideosRoutingModule} from './videos-routing.module';
import {ShowVideosComponent} from './show-videos/show-videos.component';
import {SharedModule} from '@shared/shared.module';

import {PlayVideoComponent} from '../videos/play-video/play-video.component';
import {ShowSavedVideosComponent} from './show-saved-videos/show-saved-videos.component';
import {VideoSuggestionsComponent} from './play-video/video-suggestions/video-suggestions.component';
import { VideoDetailsFormComponent } from './play-video/video-details-form/video-details-form.component';
import { ShowRegularListComponent } from './show-videos/show-regular-list/show-regular-list.component';
import { ShowSearchResultsComponent } from './show-videos/show-search-results/show-search-results.component';
import { ShowPlaylistsListComponent } from './show-videos/show-playlists-list/show-playlists-list.component';
import { VideoCommentsFormComponent } from './play-video/video-comments-form/video-comments-form.component';
import { VideoCommentsListComponent } from './play-video/video-comments-list/video-comments-list.component';
import { CommentActionsComponent } from './play-video/video-comments-list/comment-actions/comment-actions.component';
import { SingleCommentComponent } from './play-video/video-comments-list/single-comment/single-comment.component';
import { VideojsTestComponent } from './videojs-test/videojs-test.component';
import { AddVideoComponent } from './add-video/add-video.component';
import { ClipzVideoComponent } from './clipz-video/clipz-video.component';

@NgModule({
    declarations: [
        ShowVideosComponent,
        PlayVideoComponent,
        ShowSavedVideosComponent,
        VideoSuggestionsComponent,
        VideoDetailsFormComponent,
        ShowRegularListComponent,
        ShowSearchResultsComponent,
        ShowPlaylistsListComponent,
        VideoCommentsFormComponent,
        VideoCommentsListComponent,
        CommentActionsComponent,
        SingleCommentComponent,
        VideojsTestComponent,
        AddVideoComponent,
        ClipzVideoComponent
    ],
    imports: [
        CommonModule,
        VideosRoutingModule,
        SharedModule
    ]
})
export class VideosModule {
}
