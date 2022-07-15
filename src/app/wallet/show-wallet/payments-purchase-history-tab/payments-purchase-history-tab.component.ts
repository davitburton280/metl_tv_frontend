import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {MatSort} from '@angular/material/sort';
import {filter} from 'rxjs/operators';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';

@Component({
    selector: 'app-payments-purchase-history-tab',
    templateUrl: './payments-purchase-history-tab.component.html',
    styleUrls: ['./payments-purchase-history-tab.component.scss']
})
export class PaymentsPurchaseHistoryTabComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    purchases = [];
    filteredPurchases = [];
    tableData;
    displayedColumns = ['date', 'product_name', 'product_description', 'amount', 'payment_method', 'status'];

    @Input() userCards = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private paymentsService: PaymentsService,
        private subject: SubjectService,
        private isEmptyObj: CheckForEmptyObjectPipe
    ) {

    }

    ngOnInit(): void {
        this.subject.currentPaymentsData
            .pipe(filter(dt => !this.isEmptyObj.transform(dt)))
            .subscribe((dt: any) => {
                this.purchases = dt.payment_intents.filter(t => t.transfer_group === 'purchases');
                this.filteredPurchases = dt.payment_intents.filter(t => t.transfer_group === 'purchases');
                this.tableData = new MatTableDataSource(this.filteredPurchases);
                this.tableData.paginator = this.paginator;
                this.tableData.sort = this.sort;
            });
    }

    getFilters(e) {
        this.getPurchasesHistory(e);
    }

    getPurchasesHistory(filters = {}) {
        const params = {customer: this.userCards?.[0].stripe_customer_id, ...filters};
        if (params.customer) {
            this.subscriptions.push(this.paymentsService.getPurchasesHistory(params).subscribe(dt => {
                this.purchases = dt;
                this.filteredPurchases = dt;
                this.tableData = new MatTableDataSource(this.filteredPurchases);
                this.tableData.paginator = this.paginator;
                this.tableData.sort = this.sort;
            }));
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
