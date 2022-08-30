import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {StocksService} from '@core/services/stocks.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {User} from '@shared/models/user';
import {filter} from 'rxjs/operators';
import {Stock} from '@shared/models/stock';

@Component({
    selector: 'app-watchlist-tab',
    templateUrl: './watchlist-tab.component.html',
    styleUrls: ['./watchlist-tab.component.scss']
})
export class WatchlistTabComponent implements OnInit, OnDestroy {
    apiUrl = API_URL;
    authUser: User;
    search: string | null;

    subscriptions: Subscription[] = [];
    userStocks: Stock[] = [];
    filteredStocks: Stock[] = [];

    stocksLoading = 'idle';


    @Input() channelUser;

    constructor(
        private videoService: VideoService,
        private subjectService: SubjectService,
        public router: Router,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe,
        private stocksService: StocksService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.stocksLoading = 'loading';
        this.subscriptions.push(this.subjectService.getStocksSearch().subscribe(s => {
            this.getSearchResults(s);
        }));
        this.subscriptions.push(
            this.subject.currentUserStocks
                .pipe(filter(d => !d.initial))
                .subscribe(dt => {
                    this.userStocks = dt.stocks;
                    this.filteredStocks = this.userStocks;
                    this.stocksLoading = 'finished';
                }));
    }

    getSearchResults(s) {
        this.search = s;
        if (s) {
            this.filteredStocks = this.userStocks.filter(us => us.name.toLowerCase().includes(s));
        } else {
            this.filteredStocks = this.userStocks;
        }
    }

    saveUpdatedStocksList(stocks) {
        this.stocksLoading = 'loading';
        this.subscriptions.push(this.stocksService.updateFollowedStocks({
            user_id: this.authUser.id,
            ...{stocks}
        }).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
            this.subject.changeUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
            this.stocksLoading = 'finished';
            this.cdr.detectChanges();
        }));
    }

    updateStocksPriority(e) {
        const sendData = {
            order_type: 'custom',
            rows: JSON.stringify(e),
            user_id: this.authUser.id
        };

        this.subject.changeUserStocks({stocks: e, dragdrop: true});
        this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
            localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
