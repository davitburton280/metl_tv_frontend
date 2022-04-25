import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-show-playlists-list',
    templateUrl: './show-playlists-list.component.html',
    styleUrls: ['./show-playlists-list.component.scss']
})
export class ShowPlaylistsListComponent implements OnInit {

    @Input('items') items;
    @Input('authUser') authUser;

    constructor(
        public router: Router
    ) {
    }

    ngOnInit(): void {
    }

    async openPlaylistPage(playlist, firstVideoId) {
        const route = 'videos/play';
        const params = {id: firstVideoId, playlist_id: playlist.id};
        await this.router.navigate([route], {queryParams: params});
    }

}
