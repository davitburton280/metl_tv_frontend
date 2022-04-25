import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {SubjectService} from '@core/services/subject.service';
import {Card} from '@shared/models/card';
import {CardsService} from '@core/services/cards.service';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {User} from '@shared/models/user';
import {PaymentsService} from '@core/services/wallet/payments.service';

@Component({
    selector: 'app-payments-received-history-tab',
    templateUrl: './payments-received-history-tab.component.html',
    styleUrls: ['./payments-received-history-tab.component.scss']
})
export class PaymentsReceivedHistoryTabComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = [];
    // accountTransfers = [];
    filteredTransfers = [];
    tableData;
    displayedColumns = ['date', 'channel', 'description', 'amount'];

    @Input() authUser: User;
    @Input() userCards: Card[] = [];
    @Input() accountTransfers = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Output() transfersLoaded = new EventEmitter();

    constructor(
        private subject: SubjectService,
        private paymentsService: PaymentsService,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe,
    ) {
    }

    ngOnInit(): void {
        // this.getTransfersHistory({});
    }

    getTransfersHistory(filters) {
        const stripeAccountId = this.userCards?.[0].stripe_account_id;
        const params = {stripe_account_id: stripeAccountId, ...filters};
        this.subscriptions.push(this.paymentsService.getReceivedPaymentsHistory(params).subscribe(dt => {
            this.accountTransfers = dt;
            // this.filteredTransfers = this.accountTransfers;
            this.tableData = new MatTableDataSource(this.accountTransfers);
            this.tableData.paginator = this.paginator;
            // this.transfersLoaded.emit(dt);
        }));
    }

    getFilters(e) {
        this.getTransfersHistory(e);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
