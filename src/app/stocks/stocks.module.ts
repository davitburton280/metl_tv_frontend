import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StocksRoutingModule} from './stocks-routing.module';
import {StockProfileComponent} from '@app/stocks/stock-profile/stock-profile.component';
import {SummaryTabComponent} from '@app/stocks/stock-profile/summary-tab/summary-tab.component';
import {HistoricalTabComponent} from '@app/stocks/stock-profile/historical-tab/historical-tab.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {SharedModule} from '@shared/shared.module';


@NgModule({
    declarations: [
        StockProfileComponent,
        SummaryTabComponent,
        HistoricalTabComponent
    ],
    imports: [
        CommonModule,
        StocksRoutingModule,
        NgxChartsModule,
        SharedModule
    ]
})
export class StocksModule {
}
