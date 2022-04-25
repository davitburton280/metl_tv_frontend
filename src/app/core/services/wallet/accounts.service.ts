import {Injectable} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AccountsService {

    constructor(
        private httpClient: HttpClient
    ) {
    }

    checkIfUserHasStripeAccount(params) {
        return this.httpClient.get<any>(`${API_URL}stripe/accounts/check-if-stripe-account-exists`, {params});
    }

    addStripeExternalAccount(params) {
        return this.httpClient.post<any>(`${API_URL}stripe/accounts/create-stripe-external-account`, params);
    }

    getStripeAccount(params) {
        return this.httpClient.get<any>(`${API_URL}stripe/accounts/get-stripe-account`, {params});
    }

    setAsDefaultExternalAccount(params) {
        return this.httpClient.put<any>(`${API_URL}stripe/accounts/set-as-default-external-account`, params);
    }


    removeBankAccount(params) {
        return this.httpClient.delete<any>(`${API_URL}stripe/accounts/remove-bank-account`, {params});
    }

    removeDebitCard(params) {
        return this.httpClient.delete<any>(`${API_URL}stripe/accounts/remove-debit-card`, {params});
    }

}
