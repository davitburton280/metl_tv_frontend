import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    EditChannelProfileComponent,
    MainChannelPageComponent,
    PlaylistChannelComponent,
    WatchlistPageComponent
} from '@app/channel/pages';
import { ChannelVideosComponent } from '@app/channel/pages/channel-vidoes';
import { SubPageComponent } from '@app/channel/pages/sub-page';
import { AboutChannelComponent } from '@app/channel/pages/about-channel';
import { AppPlaylistVideosComponent } from '@app/channel/components';


const routes: Routes = [
    {
        path: '',
        component: MainChannelPageComponent,
        data: {
            title: 'Channel page'
        },
        children: [
            { path: '', redirectTo: 'watchlist', pathMatch: 'full' },
            {
                path: 'watchlist',
                component: WatchlistPageComponent
            },
            {
                path: 'channel-videos/:id',
                component: ChannelVideosComponent
            },
            {
                path: 'channel-subscriptions/:id',
                component: SubPageComponent
            },
            {
                path: 'channel-about/:id',
                component: AboutChannelComponent
            },
            {
                path: 'channel-playlist/:id',
                component: PlaylistChannelComponent
            },
            {
                path: 'channel-playlist/:id/playList/:id',
                component: AppPlaylistVideosComponent
            }
        ]
    },
    {
        path: ':id',
        component: EditChannelProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChannelRoutingModule {
}
