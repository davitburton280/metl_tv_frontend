import { Injectable } from '@angular/core';
import { API_URL } from '@core/constants/global';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { SubscriptionResponseInterface } from '@core/interfaces/subscription.interface';
import { ChannelCategoryInterface, ChannelVidosInterface } from '@core/interfaces/channel-vidos.interface';
import { ChannelVideoState } from '@core/services/state/channel-video.state';
import { takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ChannelsService {
    public channelVideoState$: ChannelVideoState = new ChannelVideoState();
    private _unsubscribe$ = new Subject<void>();

    constructor(
        private httpClient: HttpClient
    ) {
    }

    get(params) {
        return this.httpClient.get<any>(`${API_URL}channels/get`, { params });
    }

    public getChanelByID(id) {

        return this.httpClient.get<any>(`${API_URL}channels/detail/${id}`);
    }


    public updateChannel(id, formData) {

        return this.httpClient.put(`${API_URL}channels/${id}`, formData);
    }

    public getChannelVideosByChannelId(formData) {
        this.channelVideoState$.setLoading(true);
        this.httpClient.post<ChannelVidosInterface>(`${API_URL}channels/videos`, formData)
            .pipe(
                takeUntil(this._unsubscribe$)
            )
            .subscribe((data: ChannelVidosInterface) => {
                this.channelVideoState$.setChannelVideos(data.data.list);
                this.channelVideoState$.setLoading(false);
            });
    }

    public getChannelCategory(): Observable<ChannelCategoryInterface[]> {

        return this.httpClient.get<ChannelCategoryInterface[]>(`${API_URL}videos/get-categories`);
    }

    public getChannelSubscription(params): Observable<SubscriptionResponseInterface> {
        console.log(params, 'params');

        return this.httpClient.get<SubscriptionResponseInterface>(`${API_URL}channels/get-channel-subscribers`, { params });
    }


    public updatePrivacy(idVideo, params) {
        this.channelVideoState$.setLoading(true);
        return this.httpClient.put<any>(`${API_URL}videos/update-privacy-status`, params);

    }


    public deleteChannelVideo(params) {
        this.channelVideoState$.setLoading(true);
        return this.httpClient.delete<any>(`${API_URL}videos/remove`, { params });
    }

    getSubscriptions(params) {
        return this.httpClient.get<any>(`${API_URL}channels/subscriptions`, { params });
    }

    searchWithVideos(params) {
        return this.httpClient.get<any>(`${API_URL}channels/search-with-videos`, { params });
    }

    subscribeToChannel(params) {
        return this.httpClient.put<any>(`${API_URL}channels/subscribe`, params);
    }

    checkChannelSubscription(params) {
        return this.httpClient.get<any>(`${API_URL}channels/check-subscription`, { params });
    }

    getUserChannelSubscriptions(params) {
        return this.httpClient.get<any>(`${API_URL}channels/get-subscriptions`, { params });
    }

    changeSubscriptionPriority(params) {
        return this.httpClient.put<any>(`${API_URL}channels/subscriptions/update-priority`, params);
    }

    saveDescription(params) {
        return this.httpClient.put<any>(`${API_URL}channels/save-description`, params);
    }

    changeChannelDetails(params) {
        return this.httpClient.put<any>(`${API_URL}channels/save-channel-details`, params);
    }

    getChannelSubscriptions(params) {
        return this.httpClient.get<any>(`${API_URL}channels/get-channel-subscribers`, { params });
    }

}
