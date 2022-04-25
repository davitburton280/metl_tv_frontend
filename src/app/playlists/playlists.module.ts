import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PlaylistsRoutingModule} from './playlists-routing.module';
import {SinglePlaylistComponent} from './single-playlist/single-playlist.component';
import {SharedModule} from '@shared/shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PlaylistInfoFormComponent } from './single-playlist/playlist-info-form/playlist-info-form.component';
import { PlaylistVideosComponent } from './single-playlist/playlist-videos/playlist-videos.component';


@NgModule({
    declarations: [SinglePlaylistComponent, PlaylistInfoFormComponent, PlaylistVideosComponent],
    imports: [
        CommonModule,
        PlaylistsRoutingModule,
        DragDropModule,
        SharedModule
    ]
})
export class PlaylistsModule {
}
