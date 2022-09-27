import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from '@core/constants/global';
import { NewPlaylistInterface } from '@core/interfaces/new-playlist.interface';
import { NewPlaylistState } from '@core/services/state/new-playlist.state';
import { NewPlayListVideosState } from '@core/services/state/new-playList-videos.state';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class NewPlaylistService {
    public newPlaylistState$: NewPlaylistState = new NewPlaylistState();
    public newPlayListVideosState$: NewPlayListVideosState = new NewPlayListVideosState();

    constructor(private _httpClient: HttpClient) {
    }

    public createPlayList(formData: any) {
        console.log(11111);
        this.newPlaylistState$.setLoading(true);
        this._httpClient.post(`${API_URL}playlists/add`, formData)
            .subscribe((data: NewPlaylistInterface) => {
                this.newPlaylistState$.setLoading(false);
                console.log(22222);
                this.newPlaylistState$.createPlayList(data);
            });
    }

    public getAllPlayList() {
        this.newPlaylistState$.setLoading(true);
        this._httpClient.get<NewPlaylistInterface>(`${API_URL}playlists/get`)
            .subscribe((data: NewPlaylistInterface) => {
                this.newPlaylistState$.setLoading(false);
                this.newPlaylistState$.setPlayList(data);
            });
    }

    public remove(id: number) {
        this._httpClient.delete<any>(`${API_URL}playlists/remove?id=${id}`)
            .subscribe((data: any) => {
                this.newPlaylistState$.setLoading(false);
                this.newPlaylistState$.deletePlayList(id);
            });
    }


    public getVideosPlayListById(params: any) {
        this.newPlayListVideosState$.setLoading(true);
        this._httpClient.get<NewPlaylistInterface>(`${API_URL}playlists/get-by-id`, { params })
            .subscribe((data: NewPlaylistInterface) => {
                console.log(data);
                this.newPlayListVideosState$.setLoading(false);
                this.newPlayListVideosState$.setVideos(data);
            });
    }


}
