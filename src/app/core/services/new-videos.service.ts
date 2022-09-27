import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@core/constants/global';
import { NewVidosInterface } from '@core/interfaces/new-vidos.interface';
import { NewVideosState } from '@core/services/state/new-videos.state';
import { TradingVideosState } from '@core/services/state/trading-videos.state';
import { BehaviorSubject } from 'rxjs';
import { ClipsInterface } from '@core/interfaces/clips.interface';
import { ClipsState } from '@core/services/state/clips.state';

@Injectable({
    providedIn: 'root'
})

export class NewVideosService {
    public newVideosState$: NewVideosState = new NewVideosState();
    public tradingVideosState$: TradingVideosState = new TradingVideosState();
    public clipsState$: ClipsState = new ClipsState();
    public newPageTotalCount = new BehaviorSubject(1);

    constructor(private _httpClient: HttpClient) {
    }

    public getNewVideosApi(formData) {
        this.newVideosState$.setLoading(true);
        this._httpClient.post<NewVidosInterface>(`${API_URL}videos/list`, formData)
            .subscribe((data: any) => {
                this.newVideosState$.setLoading(false);
                console.log(data.data.count / 3, 'Count');
                this.newPageTotalCount.next(data.data.count / 4);
                this.newVideosState$.setVideos(data.data.list, data.data.count);
            });
    }

    public getTradingVideosApi(formData) {
        this.tradingVideosState$.setLoading(true);
        this._httpClient.post<NewVidosInterface>(`${API_URL}videos/list`, formData)
            .subscribe((data: any) => {
                this.tradingVideosState$.setLoading(false);
                this.tradingVideosState$.setTradingVideos(data.data.list, data.data.count);
            });
    }

    public getClipsVideosApi(formData) {
        this.clipsState$.setLoading(true);
        this._httpClient.post<ClipsInterface>(`${API_URL}videos/list`, formData)
            .subscribe((data: any) => {
                this.clipsState$.setLoading(false);
                this.clipsState$.setClip(data.data.list, data.data.count);
            });
    }
}
