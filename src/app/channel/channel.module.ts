import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {EditChannelProfileComponent, MainChannelPageComponent, WatchlistPageComponent} from '@app/channel/pages';
import {ChannelInfoComponent} from '@app/channel/components';
import {ChannelRoutingModule} from '@app/channel/channel-routing.module';
import {ChannelVideosComponent} from '@app/channel/pages/channel-vidoes';



@NgModule({
    declarations: [
        MainChannelPageComponent,
        WatchlistPageComponent,
        EditChannelProfileComponent,
        ChannelInfoComponent,
        ChannelVideosComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ChannelRoutingModule
    ]
})
export class ChannelModule {
}
