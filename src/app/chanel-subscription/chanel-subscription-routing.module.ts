import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscriptionChanelComponent } from '@app/chanel-subscription/subscription-chanel/subscription-chanel.component';
import { PlanChanelComponent } from '@app/chanel-subscription/subscription-chanel/plan-chanel/plan-chanel.component';


const routes: Routes = [
    {
        path: '',
        component: SubscriptionChanelComponent,
        data: {
            title: 'Channel Subscription'
        }
    },
    {
        path: 'plan-chanel',
        component: PlanChanelComponent,
        data: {
            title: 'Plan Channel'
        }
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChanelSubscriptionRoutingModule { }
