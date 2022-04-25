import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Card} from '@shared/models/card';
import {API_URL} from '@core/constants/global';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    getUserCards(params) {
        return this.httpClient.get<Card[]>(`${API_URL}stripe/customers/get-customer-cards`, {params});
    }

    createStripeCustomerCard(params) {
        return this.httpClient.post(`${API_URL}stripe/customers/create-customer-card`, params);
    }

    makePrimary(params) {
        return this.httpClient.put<Card[]>(`${API_URL}stripe/customers/set-customer-card-as-default`, params);
    }

    getCardDetails(params) {
        return this.httpClient.get<Card>(`${API_URL}stripe/customers/get-card-details`, {params});
    }

    updateStripeCard(params) {
        return this.httpClient.put<Card[]>(`${API_URL}stripe/customers/update-customer-card-info`, params);
    }

    removeStripeCard(params) {
        return this.httpClient.delete<Card[]>(`${API_URL}stripe/customers/remove-customer-card`, {params});
    }
}
