import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChanelSubscriptionRoutingModule } from './chanel-subscription-routing.module';
import { SubscriptionChanelComponent } from './subscription-chanel/subscription-chanel.component';
import { PlanChanelComponent } from './subscription-chanel/plan-chanel/plan-chanel.component';


@NgModule({
  declarations: [SubscriptionChanelComponent, PlanChanelComponent],
  imports: [
    CommonModule,
    ChanelSubscriptionRoutingModule
  ]
})
export class ChanelSubscriptionModule { }
