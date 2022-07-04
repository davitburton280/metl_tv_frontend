import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AccountsService} from '@core/services/wallet/accounts.service';
import {LoaderService} from '@core/services/loader.service';
import {Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-external-accounts-handler',
    templateUrl: './external-accounts-handler.component.html',
    styleUrls: ['./external-accounts-handler.component.scss']
})
export class ExternalAccountsHandlerComponent implements OnInit, OnDestroy {
    bankAccount;
    debitCardAccount;
    defaultExtAccount;
    dataLoading = false;

    subscriptions: Subscription [] = [];

    @Input() userCards = [];
    @Output() extAccountChanged = new EventEmitter();
    @Output() viewExtAccountPayouts = new EventEmitter();


    constructor(
        private accountsService: AccountsService,
        public router: Router,
        private subject: SubjectService,
        public loader: LoaderService
    ) {
    }

    ngOnInit(): void {
        this.getStripeAccount();
    }

    getStripeAccount() {
        const params = {stripe_account_id: this.userCards?.[0]?.stripe_account_id};
        if (params.stripe_account_id) {
            this.subscriptions.push(this.accountsService.getStripeAccount(params).subscribe(dt => {
                const externalAccounts = dt?.external_accounts?.data;
                this.bankAccount = externalAccounts.filter(t => t.object === 'bank_account')[0];
                this.debitCardAccount = externalAccounts.filter(t => t.object === 'card')[0];
                this.defaultExtAccount = externalAccounts.find(t => t.default_for_currency).object;
                this.subject.changeDefaultExtAccount(this.defaultExtAccount);
            }));
        }

    }

    async addExtAccount() {
        await this.router.navigate(['wallet/save-bank-account']);
    }


    removeBankAccount(bankAccount) {
        this.loader.dataLoading = true;
        const params = {account_id: bankAccount.account, bank_id: bankAccount.id};
        this.subscriptions.push(this.accountsService.removeBankAccount(params).subscribe(dt => {
            this.bankAccount = null;
            this.loader.dataLoading = false;
        }));
    }

    removeDebitCard(debitCard) {
        console.log(debitCard);
        this.loader.dataLoading = true;
        const params = {account_id: debitCard.account, card_id: debitCard.id};
        this.subscriptions.push(this.accountsService.removeDebitCard(params).subscribe(dt => {
            this.debitCardAccount = null;
            this.loader.dataLoading = false;
        }));
    }

    setAsDefaultExtAccount(acc) {
        this.loader.dataLoading = true;
        this.subscriptions.push(this.accountsService.setAsDefaultExternalAccount({
            stripe_account_id: acc.account,
            ext_account_id: acc.id
        }).subscribe(dt => {
            const externalAccounts = dt?.external_accounts?.data;
            this.bankAccount = externalAccounts.filter(t => t.object === 'bank_account')[0];
            this.debitCardAccount = externalAccounts.filter(t => t.object === 'card')[0];
            this.loader.dataLoading = false;
            this.defaultExtAccount = externalAccounts.find(t => t.default_for_currency).object;
            this.extAccountChanged.emit(this.defaultExtAccount);
            this.subject.changeDefaultExtAccount(this.defaultExtAccount);
        }));
    }

    showExtAccountPayouts(acc){
        this.viewExtAccountPayouts.emit(acc);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
