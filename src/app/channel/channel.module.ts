import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import {
    AboutChannelComponent,
    EditChannelProfileComponent,
    MainChannelPageComponent, PlaylistChannelComponent,
    WatchlistPageComponent
} from '@app/channel/pages';
import {
    AppPlaylistVideosComponent,
    ChannelInfoComponent,
    ChannelSortingComponent, CreatePlaylistBtnComponent, NewVideoPlayerComponent
} from '@app/channel/components';
import { ChannelRoutingModule } from '@app/channel/channel-routing.module';
import {
    ChannelVideosComponent,
    ChannelVidosListComponent,
    ChannelVidosListItemComponent
} from '@app/channel/pages/channel-vidoes';
import { SubPageComponent } from '@app/channel/pages/sub-page';
import { MaterialModule } from '@core/modules/material.module';
import { ConfirmDialogComponent, CreatePlaylistDialogComponent } from '@app/channel/dialogs';


@NgModule({
    declarations: [
        CreatePlaylistBtnComponent,
        MainChannelPageComponent,
        WatchlistPageComponent,
        EditChannelProfileComponent,
        ChannelInfoComponent,
        ChannelVideosComponent,
        SubPageComponent,
        ChannelVidosListComponent,
        ChannelVidosListItemComponent,
        ChannelSortingComponent,
        ConfirmDialogComponent,
        CreatePlaylistDialogComponent,
        AboutChannelComponent,
        AppPlaylistVideosComponent,
        PlaylistChannelComponent,
        NewVideoPlayerComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        ChannelRoutingModule
    ],
    entryComponents: [ConfirmDialogComponent, CreatePlaylistDialogComponent]
})
export class ChannelModule {
}
