import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StocksStoreService {
    userStocksInitial = {stocks: [], empty: true, initial: true};
    private userStocksSource = new BehaviorSubject(this.userStocksInitial);

    userStocks$ = this.userStocksSource.asObservable();

    constructor() {
    }

    setUserStocks(stocks) {
        this.userStocksSource.next(stocks);
    }
}
