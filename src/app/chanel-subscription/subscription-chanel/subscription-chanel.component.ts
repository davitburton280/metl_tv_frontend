import { Component, OnInit } from '@angular/core';
import { CHANEL_SUBSCRIPTIONS_LIST } from '@core/constants/global';
import { Router } from "@angular/router";

@Component({
  selector: 'app-subscription-chanel',
  templateUrl: './subscription-chanel.component.html',
  styleUrls: ['./subscription-chanel.component.scss']
})
export class SubscriptionChanelComponent implements OnInit {

    planList = CHANEL_SUBSCRIPTIONS_LIST;

  constructor(
      private router: Router
  ) { }

  ngOnInit(): void {
  }

    goToPlanChanel(plan) {
        const str = plan.title.slice(0, -6);
        this.router.navigate(['turbo-plan/plan-chanel'], {queryParams: {plan: str}});
    }

}
