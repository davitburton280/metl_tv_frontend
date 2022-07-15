import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {CardsService} from '@core/services/cards.service';
import {UsersService} from '@core/services/users.service';

import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {Subject, Subscription} from 'rxjs';

import {Card} from '@shared/models/card';
import {User} from '@shared/models/user';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {SubjectService} from '@core/services/subject.service';
import {AccountsService} from '@core/services/wallet/accounts.service';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {LoaderService} from '@core/services/loader.service';
import {CountPurchasedTransferredTotalsPipe} from '@shared/pipes/count-purchased-transfered-totals.pipe';
import {filter} from 'rxjs/operators';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';
import {MatSort} from '@angular/material/sort';

@Component({
    selector: 'app-wallet-content-tab',
    templateUrl: './wallet-content-tab.component.html',
    styleUrls: ['./wallet-content-tab.component.scss']
})
export class WalletContentTabComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    displayedColumns = ['date', 'amount_submitted', 'payment_method', 'status'];
    payments = [];
    filteredPayments = [];
    filterApplied = false;
    tableData;

    totals;

    @Input() authUser: User;
    @Input() accountTransfers = [];
    @Input() userCards: Card[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Output() changeTab = new EventEmitter();

    pageSize = 5;
    pageIndex = 0;

    changingValue: Subject<string> = new Subject();


    constructor(
        public auth: AuthService,
        private cardsService: CardsService,
        private paymentsService: PaymentsService,
        private accountsService: AccountsService,
        private usersService: UsersService,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe,
        public router: Router,
        private subject: SubjectService,
        public loader: LoaderService,
        private countTotals: CountPurchasedTransferredTotalsPipe,
        private isEmptyObj: CheckForEmptyObjectPipe,
    ) {
    }

    ngOnInit(): void {
        this.subject.currentPaymentsData
            .pipe(filter(dt => !this.isEmptyObj.transform(dt)))
            .subscribe((dt: any) => {
                this.payments = dt.payment_intents;
                this.totals = dt.user_coins;
            });
    }

    tellChild() {
        this.changingValue.next('export');
    }

    getFilters(e) {
        this.filterApplied = true;
        this.getPaymentsHistory(e);
    }

    getPaymentsHistory(filters) {
        const params = {
            customer: this.userCards?.[0]?.stripe_customer_id,
            user_id: this.authUser.id,
            ...filters
        };
        if (params.customer) {
            this.loader.dataLoading = true;
            this.subscriptions.push(this.paymentsService.getAllPaymentsHistory(params).subscribe(dt => {
                this.loader.dataLoading = false;
                this.payments = dt.payment_intents;
                this.totals = dt.user_coins;
            }));
        }
    }

    changeTabToPayouts() {
        this.changeTab.emit(3);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
