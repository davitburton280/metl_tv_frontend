import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WalletRoutingModule} from './wallet-routing.module';
import {ShowWalletComponent} from './show-wallet/show-wallet.component';
import {MaterialModule} from '@core/modules/material.module';
import {WalletContentTabComponent} from './show-wallet/wallet-content-tab/wallet-content-tab.component';
import {PaymentsPurchaseHistoryTabComponent} from './show-wallet/payments-purchase-history-tab/payments-purchase-history-tab.component';
import {PaymentsReceivedHistoryTabComponent} from './show-wallet/payments-received-history-tab/payments-received-history-tab.component';
import {MetlCoinsPayoutScheduleTabComponent} from './show-wallet/metl-coins-payout-schedule-tab/metl-coins-payout-schedule-tab.component';
import {SharedModule} from '@shared/shared.module';
import {SaveBankAccountComponent} from './save-bank-account/save-bank-account.component';
import {InternationalPhoneNumberModule} from 'ng-phone-number';
import { ShowCardsComponent } from './cards/show-cards/show-cards.component';
import { SaveCardComponent } from './cards/save-card/save-card.component';
import { ExternalAccountsHandlerComponent } from './show-wallet/metl-coins-payout-schedule-tab/external-accounts-handler/external-accounts-handler.component';

import { ShowWalletCardsComponent } from './show-wallet-cards/show-wallet-cards.component';


@NgModule({
    declarations: [
        ShowWalletComponent,
        WalletContentTabComponent,
        PaymentsPurchaseHistoryTabComponent,
        PaymentsReceivedHistoryTabComponent,
        MetlCoinsPayoutScheduleTabComponent,
        SaveBankAccountComponent,
        ShowCardsComponent,
        SaveCardComponent,
        ExternalAccountsHandlerComponent,
        ShowWalletCardsComponent
    ],
    imports: [
        CommonModule,
        WalletRoutingModule,
        MaterialModule,
        SharedModule,
        InternationalPhoneNumberModule,
    ]
})
export class WalletModule {
}
