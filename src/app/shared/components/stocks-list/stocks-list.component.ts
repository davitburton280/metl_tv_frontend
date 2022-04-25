import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {getFirstNItems} from '@core/helpers/get-first-n-items';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import trackByElement from '@core/helpers/track-by-element';
import {User} from '@shared/models/user';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {STOCK_ITEM_CHART_SETTINGS} from '@core/constants/charts';
import {SubjectService} from '@core/services/subject.service';
import {LoaderService} from '@core/services/loader.service';
import {StocksService} from '@core/services/stocks.service';
import {UpdateUserStocksPipe} from '@shared/pipes/update-user-stocks.pipe';
import {IsStockFollowedPipe} from '@shared/pipes/is-stock-followed.pipe';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-stocks-list',
    templateUrl: './stocks-list.component.html',
    styleUrls: ['./stocks-list.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StocksListComponent implements OnInit, OnDestroy {
    @Input('stocks') passedStocks = [];
    authUser: User;
    selectedSortType;

    stockChartSettings = STOCK_ITEM_CHART_SETTINGS;
    stocksSortTypes = [];
    editStocksList = false;
    subscriptions: Subscription[] = [];
    trackByElement = trackByElement;


    @Input('sorting') sorting = true;
    @Input('searching') searching = true;
    @Output('updatedStocksPriority') updatedStocksPriority = new EventEmitter();
    @Output('updatedStocksList') updatedStocksList = new EventEmitter();

    constructor(
        public router: Router,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        public loader: LoaderService,
        private stocksService: StocksService,
        private updateStocks: UpdateUserStocksPipe,
        private isStockFollowed: IsStockFollowedPipe,
        private dialog: MatDialog
    ) {

    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.selectedSortType = this.authUser.stocks_order_type;

        this.subscriptions.push(this.subject.currentStockSortTypes.subscribe(dt => {
            this.stocksSortTypes = dt;
        }));
    }

    onlyFirst10Stocks(stocks) {
        return getFirstNItems(stocks, 10);
    }


    getPercentageDetails(stock) {
        const value = +stock.changesPercentage; // .replace(/[(%)]/g, '')
        return {
            ...{value},
            color: (+value > 0 ? 'green' : 'red'),
            class: 'stock-' + (+value > 0 ? 'green' : 'red')
        };
    }

    getAutocompleteResults(e) {
        // this.updateFollowedStocksList(e);
    }

    getColorScheme(stock) {
        return {
            domain: (stock.changesPercentage > 0 ? ['#18B587'] : ['#F53C6F'])
        };
    }

    openStockProfile(stock) {
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([`stocks/${stock}/analytics`])
        );
    }

    dragDropped(e) {
        this.passedStocks = moveItemInArray(this.passedStocks, e.previousIndex, e.currentIndex);
        this.updatedStocksPriority.emit({
            stocks: this.passedStocks,
            orderType: this.selectedSortType.value
        });

    }

    sortStocks(type) {
        this.selectedSortType = type;
        if (type.name !== 'My sort') {

            this.passedStocks.sort((a, b) => {
                if (type.name === 'A-Z') {
                    return a.name.localeCompare(b.name);
                } else {
                    return +a.changesPercentage > +b.changesPercentage ? -1 : 1;
                }
            });

            if (type.name === 'Loss') {
                this.passedStocks.reverse();
            }
            this.updatedStocksPriority.emit({stocks: this.passedStocks, orderType: type.value});

        } else {
            this.loader.stocksLoading.status = 'loading';
            this.subscriptions.push(this.stocksService.getUserStocks({
                sort_type: type.value,
                user_id: this.authUser.id
            }).subscribe(dt => {
                this.passedStocks = dt?.user_stocks || [];
                this.loader.stocksLoading.status = 'finished';
                this.updatedStocksPriority.emit({stocks: this.passedStocks, orderType: this.selectedSortType.value});
            }));
        }
    }

    updateFollowedStocksList(stock) {
        const result = this.updateStocks.transform(this.passedStocks, stock, this.isStockFollowed.transform(this.passedStocks, stock));
        if (result) {
            this.passedStocks = result;
            this.updatedStocksList.emit(result);
            this.loader.stocksLoading.status = 'loading';
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.loader.stocksLoading.status = 'finished';
    }


}
