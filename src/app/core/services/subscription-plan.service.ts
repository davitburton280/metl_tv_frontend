import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SubscriptionPlanResponseInterface} from '@core/interfaces/subscription-plan.interface';
import {PlanChanelResponseInterface} from '@core/interfaces/plan-chanel.interface';
import {API_URL} from '@core/constants/global';

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
            // 'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });

        const requestOptions = {headers};

        return this._httpClient.get<SubscriptionPlanResponseInterface>(`${API_URL}plan`, requestOptions);

    }

    public getSubscriptionPlanViewByPermission(permission) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            // 'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });

        const requestOptions = {headers};

        return this._httpClient.get<PlanChanelResponseInterface>(`${API_URL}permission?idList=${permission}`
            , requestOptions);
    }

    public buySubscriptionPlan(formData) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        const requestOptions = {headers};

        return this._httpClient.post<any>(`${API_URL}stripe/payments/create-subscription-payment-intent`,
            formData, requestOptions);
    }
}
