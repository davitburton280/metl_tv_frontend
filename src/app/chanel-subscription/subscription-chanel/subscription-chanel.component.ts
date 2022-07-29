import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SubscriptionPlanService} from '@core/services/subscription-plan.service';
import {SubscriptionPlanData, SubscriptionPlanResponseInterface} from '@core/interfaces/subscription-plan.interface';
import {CHANEL_SUBSCRIPTIONS_LIST} from '@core/constants/global';

@Component({
    selector: 'app-subscription-chanel',
    templateUrl: './subscription-chanel.component.html',
    styleUrls: ['./subscription-chanel.component.scss']
})
export class SubscriptionChanelComponent implements OnInit {

    public planList: SubscriptionPlanData [] | undefined;
    public planListImg = CHANEL_SUBSCRIPTIONS_LIST;

    constructor(
        private router: Router,
        private _subscriptionPlanService: SubscriptionPlanService
    ) {
    }

    ngOnInit(): void {
        this._getSubscriptionPlan();
    }

    goToPlanChanel(permission, cost, plan_id) {
        this.router.navigate(['turbo-plan/plan-chanel'], {
            queryParams: {
                plan: JSON.stringify(permission),
                cost: JSON.stringify(cost),
                plan_id: JSON.stringify(plan_id)
            }
        });
    }

    private _getSubscriptionPlan() {
        this._subscriptionPlanService.getSubscriptionPlan()
            .subscribe((data: SubscriptionPlanResponseInterface) => {
                this.planList = data.data;
            });
    }

}
