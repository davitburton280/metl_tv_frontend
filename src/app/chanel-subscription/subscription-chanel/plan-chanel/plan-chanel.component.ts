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
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';
import {SubscriptionPlanService} from '@core/services/subscription-plan.service';
import {PlanChanelData, PlanChanelResponseInterface} from '@core/interfaces/plan-chanel.interface';

@Component({
    selector: 'app-plan-chanel',
    templateUrl: './plan-chanel.component.html',
    styleUrls: ['./plan-chanel.component.scss']
})
export class PlanChanelComponent implements OnInit {

    public params: any;
    private planList = CHANEL_SUBSCRIPTIONS_LIST;
    public plan: PlanChanelData [];
    public planIcon: string;
    public userCards;
    public cost: any;
    public constantCost: any;
    public totalCost: any | undefined;
    public planName: string;
    public discount: number | undefined;
    public discountMonths: number | undefined;
    public plan_id: number | undefined;
    private saleCostTotal: string;
    subscriptions: Subscription[] = [];
    authUser: CurrentUserData;

    constructor(
        private route: ActivatedRoute,
        private _location: Location,
        private subject: SubjectService,
        private dialog: MatDialog,
        private paymentsService: PaymentsService,
        private _subscriptionPlanService: SubscriptionPlanService,
        private _userInfoService: UserInfoService
    ) {
        this._getAuthInfo();
        this.params = this.route.snapshot?.queryParams?.plan;
        this.cost = this.route.snapshot?.queryParams?.cost;
        this.constantCost = this.route.snapshot?.queryParams?.cost;
        this.plan_id = this.route.snapshot?.queryParams?.plan_id;
        console.log(this.plan_id,"HRACH");
    }

    ngOnInit(): void {
        this._getPlan();
        this.subscriptions.push(this.subject.currentUserCards.subscribe(dt => {
            this.userCards = dt;
        }));
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
        });
    }

    private _getPlan() {
        this._subscriptionPlanService.getSubscriptionPlanViewByPermission(this.params)
            .subscribe((data: PlanChanelResponseInterface) => {
                this.plan = data.data.reverse();
                this.planList.forEach((elem) => {
                    this.plan.forEach((element: any) => {
                        if (elem.title.toLowerCase().includes(element.custom_fields.badgeColor)) {
                            this.planIcon = elem.img;
                            this.planName = element.custom_fields.badgeColor;
                        }
                    });

                });
            });
    }

    public onChange(event) {
        if (+event.value) {
            let total = this.cost * event.value;
            this.totalCost = total;
            this.saleCostTotal = (total - (total * (+event.value / 100))).toFixed(2);
            this.constantCost = this.saleCostTotal;
            this.discount = +event.value / 100;
            if (+event.value > 3 && +event.value <= 7) {
                this.discountMonths = 6;
            } else if (+event.value > 7 && +event.value <= 11) {
                this.discountMonths = 1;
            } else {
                this.discountMonths = +event.value;
            }
        } else {
            let total = this.cost;
            this.saleCostTotal = total;
            this.constantCost = this.saleCostTotal;
            this.discount = undefined;
            this.totalCost = undefined;
            this.discountMonths = undefined;
        }

    }

    openModalPayment() {
        this.dialog.open(PaymentPlanComponent, {
            width: '1085px',
            data: {
                plan: this.plan,
                cards: this.userCards,
                cost: this.constantCost,
                discount: this.discount
            }
        }).afterClosed().subscribe(dt => {
            if (dt?.payment.paymentIntent.status === 'succeeded') {
                this.dialog.open(PaymentCompletedComponent, {
                    width: '591px',
                    height: '292px'
                }).afterClosed().subscribe();
            }
            this.paymentsService.getAllPaymentsHistory({
                user_id: this.authUser.id,
                customer: dt.customer
            }).subscribe(ph => {
                this.subject.setAllPaymentsData(ph);
                this.subject.changePaymentsData(ph);
                const buySubscriptionInfoForBack = {
                    customer: dt.customer,
                    discount: dt.discount,
                    planId: +this.plan_id
                };
                this._subscriptionPlanService.buySubscriptionPlan(buySubscriptionInfoForBack)
                    .subscribe((data: any) => {
                    console.log(data);
                });
            });
        });
    }


    backPage() {
        this._location.back();
    }

}
