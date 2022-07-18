import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CHANEL_SUBSCRIPTIONS_LIST} from '@core/constants/global';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {MatDialog} from '@angular/material/dialog';
import {PaymentPlanComponent} from '@core/components/modals/payment-plan/payment-plan.component';
import {PaymentCompletedComponent} from '@core/components/modals/payment-completed/payment-completed.component';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

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
    authUser: CurrentUserData;

    constructor(
        private route: ActivatedRoute,
        private _location: Location,
        private subject: SubjectService,
        private dialog: MatDialog,
        private paymentsService: PaymentsService,
        private _userInfoService: UserInfoService
    ) {
        this._getAuthInfo();
        this.params = this.route.snapshot?.queryParams?.plan;
    }

    ngOnInit(): void {
        this.filterPlan(this.params, this.planList);
        this.subscriptions.push(this.subject.currentUserCards.subscribe(dt => {
            this.userCards = dt;
        }));
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'Plan Chanel  AUTHUSER DATA');
        });
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
            data: {
                plan: this.plan,
                cards: this.userCards,
            }
        }).afterClosed().subscribe(dt => {
            console.log(dt);
            if (dt?.payment.paymentIntent.status === 'succeeded') {
                this.dialog.open(PaymentCompletedComponent, {
                    width: '591px',
                    height: '292px'
                }).afterClosed().subscribe();
            }
            this.subscriptions.push(this.paymentsService.getAllPaymentsHistory({
                user_id: this.authUser.id,
                customer: dt.customer
            }).subscribe(ph => {
                this.subject.setAllPaymentsData(ph);
                this.subject.changePaymentsData(ph);
            }));
        });
    }

    backPage() {
        this._location.back();
    }

}
