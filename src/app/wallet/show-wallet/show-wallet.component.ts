import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import {Subscription} from 'rxjs';
import {CardsService} from '@core/services/cards.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {filter} from 'rxjs/operators';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {PaymentsService} from '@core/services/wallet/payments.service';

@Component({
    selector: 'app-show-wallet',
    templateUrl: './show-wallet.component.html',
    styleUrls: ['./show-wallet.component.scss']
})
export class ShowWalletComponent implements OnInit, OnDestroy, AfterViewInit {
    subscriptions: Subscription[] = [];
    userCards = [];
    authUser;
    activeTab;
    transfers = [];
    transfersLoaded = false;
    selectedTabIndex = 0;
    defaultExtAccount;


    @ViewChild('tabGroup', {static: false}) tabGroup;

    constructor(
        private dialog: MatDialog,
        private cardsService: CardsService,
        private paymentsService: PaymentsService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private subject: SubjectService,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getUserCards();
        this.getTransfersHistory({});
        this.getSavedActiveTab();
    }

    getUserCards() {
        this.subscriptions.push(
            this.subject.currentUserCards
                // .pipe(filter(uc => uc?.length > 0))
                .subscribe(dt => {
                    this.userCards = dt;
                })
        );
    }

    getTransfersHistory(filters) {
        const stripeAccountId = this.userCards?.[0]?.stripe_account_id;
        if (stripeAccountId) {
            const params = {stripe_account_id: stripeAccountId, ...filters};
            this.subscriptions.push(this.paymentsService.getReceivedPaymentsHistory(params).subscribe(dt => {
                this.transfers = dt;
                this.transfersLoaded = true;
            }));
        } else {
            this.transfersLoaded = true;
        }

    }

    getDefaultExtAccount(e) {
        this.selectedTabIndex = e;
    }

    async tabChange(e) {
        const tab = e?.tab.textLabel.toLowerCase().replace(/ /g, '_');
        this.selectedTabIndex = e.index;
        localStorage.setItem('active_wallet_tab', tab);
    }

    openModal() {
        this.subscriptions.push(this.dialog.open(CompletePurchaseModalComponent, {width: '800px'}).afterClosed().subscribe(dt => {

        }));
    }

    getActiveTab(tabGroup) {
        return tabGroup._tabs._results.map((tab, index) => {
            const t = tab.textLabel.toLowerCase().replace(/ /g, '_');
            return t === this.activeTab ? index : 0;
        }).find(t => t) || 0;
    }

    getSavedActiveTab() {
        this.activeTab = localStorage.getItem('active_wallet_tab') || 'wallet';
    }

    ngAfterViewInit(): void {
        if (this.tabGroup) {
            this.selectedTabIndex = this.getActiveTab(this.tabGroup);
            this.cdr.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
