import {Injectable} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    constructor(
        private httpClient: HttpClient
    ) {
    }

    getStripeProducts() {
        return this.httpClient.get<any>(`${API_URL}stripe/products/get-stripe-products`);
    }
}
