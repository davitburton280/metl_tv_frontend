import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChannelsRoutingModule} from './channels-routing.module';
import {ShowChannelComponent} from './show-channel/show-channel.component';
import {SharedModule} from '@shared/shared.module';
import {ChannelProfileComponent} from './show-channel/channel-profile/channel-profile.component';
import {WatchlistTabComponent} from './show-channel/watchlist-tab/watchlist-tab.component';
import {VideosTabComponent} from './show-channel/videos-tab/videos-tab.component';
import {PlaylistsTabComponent} from './show-channel/playlists-tab/playlists-tab.component';
import {AboutTabComponent} from './show-channel/about-tab/about-tab.component';
import {PeopleTabComponent} from './show-channel/people-tab/people-tab.component';
import {SubscriptionsTabComponent} from '@app/channels/show-channel/people-tab/subscriptions-tab/subscriptions-tab.component';
import {SubscribersTabComponent} from '@app/channels/show-channel/people-tab/subscribers-tab/subscribers-tab.component';


@NgModule({
    declarations: [
        ShowChannelComponent,
        ChannelProfileComponent,
        WatchlistTabComponent,
        VideosTabComponent,
        PlaylistsTabComponent,
        AboutTabComponent,
        PeopleTabComponent,
        SubscriptionsTabComponent,
        SubscribersTabComponent
    ],
    imports: [
        CommonModule,
        ChannelsRoutingModule,
        SharedModule,
    ]
})
export class ChannelsModule {
}
