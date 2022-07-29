import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CurrentUserResponseInterface} from '@core/interfaces';
import {BehaviorSubject} from 'rxjs';
import {API_URL} from '@core/constants/global';

@Injectable({
    providedIn: 'root'
})

export class UserInfoService {
    public _userInfo: any = new BehaviorSubject(null);

    constructor(
        private _httpClient: HttpClient) {
        this._getCurrentUserInfo();
    }




    public _getCurrentUserInfo() {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });

        const requestOptions = {headers};
        this._httpClient.get<CurrentUserResponseInterface>(`${API_URL}users/detail`, requestOptions)
            .subscribe((data: CurrentUserResponseInterface) => {
                this._userInfo.next(data.data);
            });
    }
}
