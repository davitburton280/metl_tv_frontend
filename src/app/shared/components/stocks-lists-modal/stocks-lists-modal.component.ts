import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {StocksService} from '@core/services/stocks.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {updateStockDetails} from '@core/helpers/update-stock-details';
import {Subscription} from 'rxjs';
import {LoaderService} from '@core/services/loader.service';
import {ToastrService} from 'ngx-toastr';
import {StocksStoreService} from '@core/services/stores/stocks-store.service';

@Component({
    selector: 'app-stocks-lists',
    templateUrl: './stocks-lists-modal.component.html',
    styleUrls: ['./stocks-lists-modal.component.scss']
})
export class StocksListsModalComponent implements OnInit, OnDestroy {
    stockTypes;
    stocks = [];
    selectedStockType;
    filteredStocks = [];
    filteredUserStocks = [];
    userStocks = [];
    authUser;
    search;
    searched = false;

    public pageSize = 14;
    public pageIndex = 0;

    subscriptions: Subscription[] = [];


    constructor(
        private dialog: MatDialog,
        private matDialogRef: MatDialogRef<StocksListsModalComponent>,
        private stocksService: StocksService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        public loader: LoaderService,
        private stocksStore: StocksStoreService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.getStocksByType('stocks');
        this.authUser = this.getAuthUser.transform();
        this.subscriptions.push(this.subject.currentStockTypes.subscribe(dt => {
            this.stockTypes = dt;
            this.selectedStockType = dt[0];
            this.getUserStocks();
        }));
    }

    getUserStocks(params = {}) {
        this.loader.stocksLoading.text = 'Loading user stocks list and charts';
        this.subscriptions.push(this.stocksService.getUserStocks({
            user_id: this.authUser.id,
            ...params
        }).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
            this.loader.stocksLoading.text = 'Loading stocks of selected category and charts';
        }));
    }

    closeModal() {
        this.matDialogRef.close();
        this.selectedStockType = null;
        this.subject.changeUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
    }

    stockTypeChanged(e) {
        this.selectedStockType = this.stockTypes.find(t => t.value === e.target.value);
        this.filteredStocks = [];
        if (this.search) {
            this.searchInStockType();
        } else {
            // this.getUserStocks({type_id: this.selectedStockType.id});
            this.getStocksByType(this.selectedStockType.value);
        }
    }

    getStocksByType(type) {
        this.loader.stocksLoading.status = 'loading';
        this.cdr.detectChanges();
        this.subscriptions.push(this.stocksService.getStocksByType({type}).subscribe(dt => {
            this.stocks = dt;

            this.pageSize = 14;
            this.pageIndex = 0;
            this.filterStocks();
            this.loader.stocksLoading.status = 'finished';
            // const stockNamesList = this.filteredStocks.map(f => f.symbol).join(',');
            // this.getStockGraphsDataByType(stockNamesList, dt);
        }));
    }

    getStockGraphsDataByType(stocks, allStocks, filter = false) {
        this.loader.stocksLoading = {status: 'loading', text: 'Loading charts data'};
        if (stocks) {
            this.subscriptions.push(this.stocksService.getStockGraphsDataByType({stocks}).subscribe(dt => {
                const st = allStocks.map((item, i) => Object.assign({}, item, dt[i]));
                if (filter) {
                    this.filteredStocks = st;
                } else {
                    this.stocks = st;
                    this.filterStocks();
                }
                this.loader.stocksLoading.status = 'finished';
            }));
        } else {
            this.loader.stocksLoading.status = 'finished';
        }

    }

    // Filters routes for floating panel
    filterStocks() {
        this.filteredStocks = this.stocks.slice(this.pageIndex * this.pageSize,
            this.pageIndex * this.pageSize + this.pageSize);
        // this.filteredUserStocks = this.userStocks.slice(this.pageIndex * this.pageSize,
        //     this.pageIndex * this.pageSize + this.pageSize);

    }

    // Handles floating panel routes pagination
    handle(e) {

        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.filterStocks();
        const stockNamesList = this.filteredStocks.map(f => f.symbol).join(',');
        this.getStockGraphsDataByType(stockNamesList, this.filteredStocks, true);
    }

    updateFollowedStocks(stocks) {
        this.loader.stocksLoading.status = 'loading';

        this.loader.stocksLoading.text = 'Updating stocks lists, details and charts';
        this.subscriptions.push(this.stocksService.updateFollowedStocks({
            user_id: this.authUser.id,
            ...{stocks},
            // type_id: this.selectedStockType.id
        }).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
            this.stocksStore.setUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
            this.loader.stocksLoading.status = 'finished';
        }));

    }

    getUpdatedStockDetails(userStocks) {
        return updateStockDetails(userStocks, this.stocks);
    }

    getSearchResults(e) {
        this.search = e?.search;
        this.searched = true;
        if (this.search) {
            this.loader.stocksLoading.status = 'loading';
            this.loader.stocksLoading.text = 'Searching in the selected category of stocks';
            this.searchInStockType();
        } else {
            this.getStocksByType(this.selectedStockType.value);
        }

    }

    searchInStockType() {
        if (this.search) {
            this.subscriptions.push(this.stocksService.searchInStockTypeData({
                search: this.search,
                stockType: this.selectedStockType.value
            }).subscribe((dt: any) => {
                this.stocks = dt;
                // this.stocksLoading.status = 'finished';
                this.filterStocks();
                const stockNamesList = this.filteredStocks.map(f => f.symbol).join(',');
                this.getStockGraphsDataByType(stockNamesList, this.filteredStocks, true);
            }));
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.loader.stocksLoading.status = 'finished';
    }

}
