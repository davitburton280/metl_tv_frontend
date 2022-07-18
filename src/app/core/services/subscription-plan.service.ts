import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SubscriptionPlanResponseInterface} from '@core/interfaces/subscription-plan.interface';

@Injectable({
    providedIn: 'root'
})

export class SubscriptionPlanService {
    constructor(
        private _httpClient: HttpClient) {
    }

    public getSubscriptionPlan() {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });

        const requestOptions = {headers};

        return this._httpClient.get<SubscriptionPlanResponseInterface>(`https://22e8-37-252-80-33.ngrok.io/plan`, requestOptions);

    }
}
