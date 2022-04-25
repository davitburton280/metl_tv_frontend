import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileFormComponent} from './show-profile/profile-form/profile-form.component';
import {VideoComponent} from '@app/users/openvidu-stuff/publisher-flow/video/video.component';
import {VideoLibraryComponent} from '@app/users/openvidu-stuff/openvidu-test/video-library/video-library.component';
import {PublisherFlowComponent} from '@app/users/openvidu-stuff/publisher-flow/publisher-flow.component';
import {SubscriberFlowComponent} from '@app/users/openvidu-stuff/subscriber-flow/subscriber-flow.component';
import {DoNotLeavePageGuard} from '@core/guards/do-not-leave-page.guard';
import {ShowNotificationsComponent} from '@app/users/show-notifications/show-notifications.component';
import {ShowProfileComponent} from '@app/users/show-profile/show-profile.component';
import {ConnectionsTabComponent} from '@app/users/show-profile/connections-tab/connections-tab.component';
import {ConnectionRequestsTabComponent} from '@app/users/show-profile/connection-requests-tab/connection-requests-tab.component';
import {WatchlistTabComponent} from '@app/users/show-profile/watchlist-tab/watchlist-tab.component';
import {CardsTabComponent} from '@app/users/show-profile/cards-tab/cards-tab.component';

const routes: Routes = [
    {
        path: 'video',
        children: [
            {
                path: 'check-streaming-requirements',
                component: PublisherFlowComponent,
                data: {
                    title: 'Streaming requirements check',
                }
            },
            {
                path: 'start-live-video',
                component: PublisherFlowComponent,
                data: {
                    title: 'Devices and requirements check',
                }
            },
            {
                path: 'publish',
                component: VideoComponent,
                canDeactivate: [DoNotLeavePageGuard],
                data: {
                    title: 'Start live streaming',
                }
            },
            {
                path: 'watch',
                component: SubscriberFlowComponent,
                data: {
                    title: 'Watch live stream',
                }
            },
            {
                path: 'openvidu-test',
                component: VideoLibraryComponent
            },

        ]
    },
    {
        path: 'notifications',
        component: ShowNotificationsComponent
    },


    {
        path: ':username',
        children: [
            {
                path: '',
                component: ShowProfileComponent
            },
            {
                path: 'edit',
                component: ProfileFormComponent,
                pathMatch: 'full',
                data: {
                    title: 'User profile-form',
                }
            },
            {
                path: 'tab',
                component: ShowProfileComponent,
                children: [
                    {path: 'watchlist', component: WatchlistTabComponent},
                    {path: 'connections', component: ConnectionsTabComponent},
                    {path: 'requests', component: ConnectionRequestsTabComponent},
                    {path: 'cards', component: CardsTabComponent},
                ]
            },
        ]
    },

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {
}
