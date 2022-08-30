import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowChannelComponent} from '@app/channels/show-channel/show-channel.component';
import {WatchlistTabComponent} from '@app/channels/show-channel/watchlist-tab/watchlist-tab.component';
import {VideosTabComponent} from '@app/channels/show-channel/videos-tab/videos-tab.component';
import {PlaylistsTabComponent} from '@app/channels/show-channel/playlists-tab/playlists-tab.component';
import {PeopleTabComponent} from '@app/channels/show-channel/people-tab/people-tab.component';
import {AboutTabComponent} from '@app/channels/show-channel/about-tab/about-tab.component';
import {EditChannelProfileComponent} from '@app/channels/show-channel/edit-channel-profile/edit-channel-profile.component';


const routes: Routes = [
    {
        path: 'show',
        component: ShowChannelComponent,
        data: {
            title: 'Channel page'
        }
    },
    {
        path: ':username',
        children: [
            {
                path: '',
                component: ShowChannelComponent,
                children: [
                    {path: '', component: WatchlistTabComponent},
                ]
            },
            {
                path: ':id',
                component: EditChannelProfileComponent
            },
            {
                path: 'tab',
                component: ShowChannelComponent,
                children: [
                    {path: 'watchlist', component: WatchlistTabComponent},
                    {path: 'videos', component: VideosTabComponent},
                    {path: 'playlists', component: PlaylistsTabComponent},
                    {path: 'contacts', component: PeopleTabComponent},
                    {path: 'about', component: AboutTabComponent},
                ]
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChannelsRoutingModule {
}
