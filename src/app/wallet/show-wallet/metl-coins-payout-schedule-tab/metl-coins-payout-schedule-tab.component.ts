import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {Card} from '@shared/models/card';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {LoaderService} from '@core/services/loader.service';

@Component({
    selector: 'app-metl-coins-payout-schedule-tab',
    templateUrl: './metl-coins-payout-schedule-tab.component.html',
    styleUrls: ['./metl-coins-payout-schedule-tab.component.scss']
})
export class MetlCoinsPayoutScheduleTabComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    accountPayouts = [];
    filteredPayouts = [];
    tableData;
    displayedColumns = ['initiated', 'est._arrival', 'payout_for', 'description', 'type', 'amount'];
    defaultExtAccount;

    @Input() userCards: Card[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private paymentsService: PaymentsService,
        public loader: LoaderService
    ) {
    }

    ngOnInit(): void {
        this.getPayoutsHistory({});
    }

    getExtAccountType(e) {
        console.log(e.object)
        this.getPayoutsHistory({type: e.object});
    }

    getPayoutsHistory(filters) {
        const params = {...filters};
        const stripeAccountId = this.userCards?.[0].stripe_account_id;
        if (stripeAccountId) {
            params.stripe_account_id = stripeAccountId;
        }

        this.loader.dataLoading = true;
        this.subscriptions.push(this.paymentsService.getPayoutsHistory(params).subscribe(dt => {
            this.accountPayouts = dt;
            this.filteredPayouts = dt;
            this.loader.dataLoading = false;
        }));
    }

    getFilters(e) {
        console.log(e)
        // this.getPayoutsHistory(e);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
