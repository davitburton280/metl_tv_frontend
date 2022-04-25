import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SinglePlaylistComponent} from '@app/playlists/single-playlist/single-playlist.component';


const routes: Routes = [
    {
        path: 'single/:id',
        component: SinglePlaylistComponent,
        data: {
            title: 'Edit Playlist'
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistsRoutingModule { }
