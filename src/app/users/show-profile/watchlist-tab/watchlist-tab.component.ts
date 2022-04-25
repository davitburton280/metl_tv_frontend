import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '@shared/models/user';
import {Subscription} from 'rxjs';
import {StocksStoreService} from '@core/services/stores/stocks-store.service';
import {filter} from 'rxjs/operators';
import {StocksService} from '@core/services/stocks.service';

@Component({
    selector: 'app-watchlist-tab',
    templateUrl: './watchlist-tab.component.html',
    styleUrls: ['./watchlist-tab.component.scss']
})
export class WatchlistTabComponent implements OnInit, OnDestroy {
    @Input() authUser: User;
    @Input() profileUser: User;
    @Input() profileUserStocks;

    subscriptions: Subscription[] = [];

    userStocks = [];
    filteredStocks = [];
    stocksLoading = false;

    constructor(
        private stocksStore: StocksStoreService,
        private stocksService: StocksService,
    ) {
    }

    ngOnInit(): void {
        if (this.authUser.id === this.profileUser.id) {
            this.trackUserStocks();
        } else {
            this.getProfileUserStocks();
        }
    }

    trackUserStocks() {
        this.stocksLoading = true;
        this.subscriptions.push(
            this.stocksStore.userStocks$
                .pipe(filter(d => !d.initial))
                .subscribe(dt => {
                    this.userStocks = dt.stocks;
                    this.filteredStocks = this.userStocks;
                    this.stocksLoading = false;
                }));
    }

    getProfileUserStocks() {
        console.log('OK', this.profileUserStocks)
        this.userStocks = this.profileUserStocks;
        this.filteredStocks = this.userStocks;
        this.stocksLoading = false;
    }

    saveUpdatedStocksList(stocks) {
        // this.stocksLoading = 'loading';
        this.subscriptions.push(this.stocksService.updateFollowedStocks({
            user_id: this.authUser.id,
            ...{stocks}
        }).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
            this.stocksStore.setUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
            // this.stocksLoading = 'finished';
            // this.cdr.detectChanges();
        }));
    }

    updateStocksPriority(e) {
        const sendData = {
            order_type: 'custom',
            rows: JSON.stringify(e),
            user_id: this.authUser.id
        };

        this.stocksStore.setUserStocks({stocks: e, dragdrop: true});
        this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
            localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
