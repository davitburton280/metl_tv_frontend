import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EditChannelProfileComponent, MainChannelPageComponent, WatchlistPageComponent} from '@app/channel/pages';
import {ChannelVideosComponent} from '@app/channel/pages/channel-vidoes';


const routes: Routes = [
    {
        path: '',
        component: MainChannelPageComponent,
        data: {
            title: 'Channel page'
        },
        children: [
            {path: '', redirectTo: 'watchlist', pathMatch: 'full'},
            {
                path: 'watchlist',
                component: WatchlistPageComponent
            },
            {
                path: 'channel-videos/:id',
                component: ChannelVideosComponent
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
