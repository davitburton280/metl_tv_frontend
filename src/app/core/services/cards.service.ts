import {Injectable} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {Card} from '@shared/models/card';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CardsService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    createStripeCard(params) {
        return this.httpClient.post(`${API_URL}cards/create-stripe-user-card`, params);
    }

    getUserCards(params) {
        return this.httpClient.get<Card[]>(`${API_URL}cards/get-customer-cards`, {params});
    }

    getCardDetails(params) {
        return this.httpClient.get<Card>(`${API_URL}cards/get-card-details`, {params});
    }

    removeStripeCard(params) {
        return this.httpClient.delete<Card[]>(`${API_URL}cards/remove-stripe-user-card`, {params});
    }

    updateStripeCard(params) {
        return this.httpClient.put<Card[]>(`${API_URL}cards/update-stripe-user-card-info`, params);
    }

    makePrimary(params) {
        return this.httpClient.put<Card[]>(`${API_URL}cards/set-customer-card-as-default`, params);
    }
}
