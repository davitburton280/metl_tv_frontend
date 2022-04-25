import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowVideosComponent} from '@app/videos/show-videos/show-videos.component';
import {PlayVideoComponent} from '@app/videos/play-video/play-video.component';
import {ShowSavedVideosComponent} from '@app/videos/show-saved-videos/show-saved-videos.component';
import {AuthGuard} from '@core/guards/auth.guard';
import {VideojsTestComponent} from '@app/videos/videojs-test/videojs-test.component';
import {AddVideoComponent} from '@app/videos/add-video/add-video.component';


const routes: Routes = [
    {
        path: 'add',
        component: AddVideoComponent
    },
    {
        path: 'test',
        component: VideojsTestComponent
    },
    {
        path: '',
        component: ShowVideosComponent,
        pathMatch: 'full',
        data: {
            title: 'Videos',
        }
    },
    {
        path: 'play',
        component: PlayVideoComponent,
        data: {
            title: 'Play Video',
        }
    },
    {
        path: 'saved',
        component: ShowSavedVideosComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Saved Videos',
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VideosRoutingModule {
}

