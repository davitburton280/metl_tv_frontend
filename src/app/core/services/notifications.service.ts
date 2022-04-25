import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL} from "@core/constants/global";

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    getAuthUserNotifications(params) {
        return this.httpClient.get(`${API_URL}notifications/get`, {params});
    }

    readNotification(params) {
        return this.httpClient.put(`${API_URL}notifications/read`, params);
    }

    removeNotification(params) {
        return this.httpClient.delete(`${API_URL}notifications/remove`, {params});
    }

    removeAllNotifications(params) {
        return this.httpClient.delete(`${API_URL}notifications/remove-all`, {params});
    }

    markNotificationsAsRead(params) {
        return this.httpClient.put(`${API_URL}notifications/mark-all-as-read`, params);
    }
}
