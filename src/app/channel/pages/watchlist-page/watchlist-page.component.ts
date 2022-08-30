import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {Subscription} from 'rxjs';
import {Stock} from '@shared/models/stock';
import {VideoService} from '@core/services/video.service';
import {SubjectService} from '@core/services/subject.service';
import {Router} from '@angular/router';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {StocksService} from '@core/services/stocks.service';
import {filter} from 'rxjs/operators';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';
import {StocksListsModalComponent} from '@shared/components/stocks-lists-modal/stocks-lists-modal.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-watchlist-page',
    templateUrl: 'watchlist-page.component.html',
    styleUrls: ['watchlist-page.component.scss']
})

export class WatchlistPageComponent implements OnInit, OnDestroy {
    apiUrl = API_URL;
    authUser: CurrentUserData | undefined;
    search: string | null;

    subscriptions: Subscription[] = [];
    userStocks: Stock[] = [];
    filteredStocks: Stock[] = [];

    stocksLoading = 'idle';


    @Input() channelUser;

    constructor(
        private videoService: VideoService,
        private _userInfoService: UserInfoService,
        private subjectService: SubjectService,
        public router: Router,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe,
        private stocksService: StocksService,
        private subject: SubjectService,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
    ) {
        this._currentUserData();
    }

    ngOnInit(): void {
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

    private _currentUserData() {
        this._userInfoService._userInfo
            .subscribe((data: CurrentUserData) => {
                console.log(data?.channel?.name === data?.username);
                // this.authUser = data?.channel;
            });
    }

    searchInUserStocks(e) {
        localStorage.setItem('searchStock', e.search);
        this.subjectService.setStocksSearch(e.search);
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
            user_id: this.authUser?.id
        };

        this.subject.changeUserStocks({stocks: e, dragdrop: true});
        this.stocksService.updateUserStocksPriority(sendData).subscribe(dt => {
            localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
        });
    }

    openModal() {
        this.dialog.open(StocksListsModalComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'stocks-lists-modal'
        }).afterClosed().subscribe(dt => {
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
