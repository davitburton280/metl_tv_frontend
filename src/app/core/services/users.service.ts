import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';


@Injectable({
    providedIn: 'root'
})
export class UsersService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    changeProfileImage(params) {
        return this.httpClient.post<any>(`${API_URL}users/change-profile-image`, params);
    }

    changeCoverImage(params) {
        return this.httpClient.post<any>(`${API_URL}users/change-cover-image`, params);
    }

    getUserInfo(params) {
        return this.httpClient.get<any>(`${API_URL}users/get-user-info`, {params});
    }

    saveProfileChanges(params) {
        return this.httpClient.put<any>(`${API_URL}users/save-profile-changes`, params);
    }

    blockUser(params) {
        return this.httpClient.put<any>(`${API_URL}users/block-user`, params);
    }

    getUserContacts(params) {
        return this.httpClient.get<any>(`${API_URL}users/get-contacts`, {params});
    }

    getUserConnections(params) {
        return this.httpClient.get<any>(`${API_URL}users/get-connections`, {params});
    }

    checkIfUsersConnected(params) {
        return this.httpClient.get<any>(`${API_URL}users/check-connection`, {params});
    }


}
