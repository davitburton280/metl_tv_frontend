import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StockProfileComponent} from '@app/stocks/stock-profile/stock-profile.component';


const routes: Routes = [
    {
        path: 'analytics',
        component: StockProfileComponent,
        data: {
            title: 'Stock profile',
        }
    },
    {
        path: ':symbol/analytics',
        component: StockProfileComponent,
        data: {
            title: 'Stock profile',
        }
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StocksRoutingModule {
}
