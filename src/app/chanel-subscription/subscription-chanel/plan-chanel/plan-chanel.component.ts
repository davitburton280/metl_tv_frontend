import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CHANEL_SUBSCRIPTIONS_LIST } from '@core/constants/global';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { SubjectService } from '@core/services/subject.service';
import { MatDialog } from '@angular/material/dialog';
import { PaymentPlanComponent } from '@core/components/modals/payment-plan/payment-plan.component';

@Component({
  selector: 'app-plan-chanel',
  templateUrl: './plan-chanel.component.html',
  styleUrls: ['./plan-chanel.component.scss']
})
export class PlanChanelComponent implements OnInit {

    params;
    planList = CHANEL_SUBSCRIPTIONS_LIST;
    plan;
    userCards;
    subscriptions: Subscription[] = [];

  constructor(
      private route: ActivatedRoute,
      private _location: Location,
      private subject: SubjectService,
      private dialog: MatDialog
  ) {
      this.params = this.route.snapshot?.queryParams?.plan;
  }

  ngOnInit(): void {
      this.filterPlan(this.params, this.planList);
      this.subscriptions.push(this.subject.currentUserCards.subscribe(dt => {
          this.userCards = dt;
          console.log(this.userCards);
      }));
  }

  filterPlan(value, arr) {
      arr.forEach((elem) => {
          if (elem.title.includes(value)) {
              this.plan = elem;
          }
      });
  }

    openModalPayment() {
      this.dialog.open(PaymentPlanComponent, {
          width: '1085px',
          height: '938px',
          data: {
              plan: this.plan,
              cards: this.userCards,
          }
      }).afterClosed().subscribe(dt => {
          console.log(dt);
      });
    }

    backPage() {
      this._location.back();
    }

}
