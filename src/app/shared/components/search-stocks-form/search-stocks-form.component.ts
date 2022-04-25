import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fromEvent, Subscription} from 'rxjs';
import {StocksService} from '@core/services/stocks.service';
import {Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, filter, tap} from 'rxjs/operators';

@Component({
    selector: 'app-search-stocks-form',
    templateUrl: './search-stocks-form.component.html',
    styleUrls: ['./search-stocks-form.component.scss']
})
export class SearchStocksFormComponent implements OnInit, OnDestroy {
    searchStocksForm: FormGroup;
    subscriptions: Subscription[] = [];
    searchResults = [];
    loadingSearch = 'idle';

    @Input('autocomplete') autocomplete = false;
    @Input('groupResults') groupResults = false;
    @Input('returnSearchText') returnSearchText = false;
    @Input('returnFoundStock') returnFoundStock = false;
    @Input('searchOnEnter') searchOnEnter = false;
    @Input('openStockOnEnter') openStockOnEnter = false;
    @Input('updateStocksOnEnter') updateStocksOnEnter = false;
    @Input('whiteForm') whiteForm = false;
    @Input('formWidth') formWidth = 100;
    @Input('transparentForm') transparentForm = false;

    @Output('search') search = new EventEmitter();
    @ViewChild('searchInput', {static: true}) input: ElementRef;

    constructor(
        private fb: FormBuilder,
        private stocksService: StocksService,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.searchStocksForm = this.fb.group({search: ['', Validators.required]});
        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(500),
                distinctUntilChanged(),
                tap((event: KeyboardEvent) => {
                    this.handleRegularKeyup();
                })
            )
            .subscribe();
    }

    handleRegularKeyup() {
        if (!this.searchOnEnter && this.autocomplete) {
            this.searchStocks();
        }
    }

    handleEnter() {
        if (this.searchOnEnter) {
            this.searchStocks();
        } else if (this.returnSearchText) {
            this.search.emit(this.searchStocksForm.value);
        }
    }

    searchStocks() {
        this.loadingSearch = 'loading';
        this.searchResults = [];
        this.subscriptions.push(
            this.stocksService.searchStocks({
                ...this.searchStocksForm.value,
                grouped: this.groupResults ? 1 : 0
            }).subscribe(dt => {
                this.loadingSearch = 'finished';
                this.searchResults = dt.slice(0, 10);
            }));
    }

    handleStockClick(stock, trigger) {
        trigger.closePanel();

        if (this.openStockOnEnter) {
            this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
                await this.router.navigate([`stocks/${stock.symbol || stock}/analytics`])
            );
        } else {
            this.search.emit(this.returnSearchText ? this.searchStocksForm.value : stock);
        }
        this.searchStocksForm.reset();
    }

    getPlaceholder() {
        return this.autocomplete ? 'Search for stocks...' : 'Press \'Enter\' key to search stocks';
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
