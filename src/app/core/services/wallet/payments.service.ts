import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@core/constants/global';

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {
    constructor(
        private httpClient: HttpClient
    ) {
    }

    getReceivedPaymentsHistory(params) {
        return this.httpClient.get<any>(`${API_URL}stripe/payments/get-account-transfers`, {params});
    }

    createPaymentIntent(params) {
        console.log('params payments service ', params);
        return this.httpClient.post<any>(`${API_URL}stripe/payments/create-payment-intent`, params);
    }

    getAllPaymentsHistory(params) {
        return this.httpClient.get<any>(`${API_URL}stripe/payments/get-all-payments-history`, {params});
    }

    getPurchasesHistory(params) {
        return this.httpClient.get<any>(`${API_URL}stripe/payments/get-purchases-history`, {params});
    }

    getPayoutsHistory(params) {
        return this.httpClient.get<any>(`${API_URL}stripe/payments/get-payouts-history`, {params});
    }



}
