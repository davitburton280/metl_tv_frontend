import {Component, Input, OnInit} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {Router} from '@angular/router';
import {PlaylistsService} from '@core/services/playlists.service';
import {AddPlaylistDialogComponent} from '@core/components/modals/add-playlist-dialog/add-playlist-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SubjectService} from '@core/services/subject.service';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {Subscription} from 'rxjs';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import trackByElement from '@core/helpers/track-by-element';

@Component({
    selector: 'app-playlists-tab',
    templateUrl: './playlists-tab.component.html',
    styleUrls: ['./playlists-tab.component.scss']
})
export class PlaylistsTabComponent implements OnInit {
    playlists = [];
    apiUrl = API_URL;
    showFilters = false;
    search = '';
    filters = null;
    subscriptions: Subscription[] = [];
    trackByElement = trackByElement;
    @Input('channelUser') channelUser;
    @Input('authUser') authUser;

    constructor(
        public router: Router,
        private playlistsService: PlaylistsService,
        private subjectService: SubjectService,
        private dialog: MatDialog,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe
    ) {

    }


    ngOnInit(): void {
        this.search = '';
        // localStorage.getItem('search');
        this.getPlaylists({search: this.search, filters: this.filters});
        this.getFiltersToggleState();
    }

    getFiltersToggleState() {
        this.subscriptions.push(this.subjectService.getToggleFiltersData().subscribe(dt => {
            this.showFilters = dt;
        }));
    }


    getPlaylists(params) {

        params = this.getExactParams.transform(params);

        this.playlistsService.get({
            channel_id: this.channelUser.channel.id,
            user_id: this.authUser.id, ...params
        }).subscribe(dt => {
            this.playlists = dt;
            // console.log(this.authUser, this.channelUser)
        });
    }

    openAddPlaylistModal() {
        this.dialog.open(AddPlaylistDialogComponent,
            {
                data: {channel_id: this.channelUser.channel.id}
            })
            .afterClosed().subscribe(dt => {
            this.getPlaylists({search: this.search, filters: this.filters});
        });
    }

    openPlaylistPage(playlist, firstVideoId) {
        const route = 'videos/play';
        const params = {id: firstVideoId, playlist_id: playlist.id};
        this.router.navigate([route], {queryParams: params});
    }

    getSearchResults(search) {
        this.search = search;
        this.getPlaylists({search, filters: this.filters});
    }

    getFilteredPlaylists(filters) {
        this.filters = filters;
        this.getPlaylists({search: this.search, filters});
    }

    goToEditPage(playlist) {
        this.router.navigate(['playlists/single/' + playlist.id]);
    }

    removePlaylist(id, channelId) {
        this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.playlistsService.removePlaylist({id, channel_id: channelId}).subscribe(dt => {
                    this.getPlaylists({search: this.search, filters: this.filters});
                });
            }
        });
    }

}
