import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from '@core/services/loader.service';
import {STRIPE_CARD_OPTIONS} from '@core/constants/global';
import {StripeElementsOptions} from '@stripe/stripe-js';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Card} from '@shared/models/card';
import {User} from '@shared/models/user';
import {CustomersService} from '@core/services/wallet/customers.service';
import {ToastrService} from 'ngx-toastr';
import {generateStripeCardData} from '@core/helpers/generate-stripe-card-data';
import {StripeCardComponent, StripeService} from 'ngx-stripe';
import {SubjectService} from '@core/services/subject.service';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-save-card',
    templateUrl: './save-card.component.html',
    styleUrls: ['./save-card.component.scss']
})
export class SaveCardComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    authUser: User;

    cardId;
    cardDetails;
    editCase = false;
    saveCardForm: FormGroup;

    // Stripe card
    cardOptions = STRIPE_CARD_OPTIONS;
    elementsOptions: StripeElementsOptions = {locale: 'en'};

    isSubmitted = false;

    @ViewChild(StripeCardComponent) card: StripeCardComponent;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        public loader: LoaderService,
        private fb: FormBuilder,
        private customersService: CustomersService,
        private stripeService: StripeService,
        private toastr: ToastrService,
        private subject: SubjectService,
        private _userInfoService: UserInfoService
    ) {
        this._getAuthInfo();
        this.saveCardForm = this.fb.group({
            name: ['', Validators.required],
            primary: [0]
        });
    }

    ngOnInit(): void {
        // this.authUser = this.getAuthUser.transform();
        this.cardId = this.route.snapshot.params?.id;
        this.editCase = !!this.cardId;
        if (this.editCase) {
            this.getCardDetails();
        }
    }


    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'WALLET SAVE CARD AUTHUSER DATA');
        });
    }

    getCardDetails() {
        this.customersService.getCardDetails({card_id: this.cardId}).subscribe((dt: Card) => {
            this.cardDetails = dt;
            this.saveCardForm.patchValue({name: dt.name});
        });
    }

    saveCard() {
        this.isSubmitted = true;
        if (this.saveCardForm.valid) {
            this.loader.dataLoading = true;

            if (this.editCase) {
                this.subscriptions.push(this.customersService.updateStripeCard({
                    card_id: this.cardId,
                    ...this.saveCardForm.value
                }).subscribe(async (dt) => {
                    this.loader.dataLoading = false;
                    this.toastr.success('The card info has been updated successfully');
                    await this.router.navigate(['/wallet/show']);
                }));
            } else {
                console.log('save card ', this.card);
                this.subscriptions.push(this.stripeService
                    .createToken(this.card.element, {name: this.authUser.first_name + ' ' + this.authUser.last_name})
                    .subscribe(result => {
                        if (result.token) {
                            const cardData = generateStripeCardData(result, this.authUser, this.saveCardForm.value.name);
                            this.customersService.createStripeCustomerCard(cardData).subscribe(async (dt: any) => {
                                this.loader.dataLoading = false;
                                this.toastr.success('The card has been added successfully');
                                this.subject.changeUserCards(dt);
                                await this.router.navigate(['/wallet/show']);

                            });
                        } else if (result.error) {
                            this.loader.dataLoading = false;
                            this.toastr.error(result.error.message);
                        }
                    }));
            }
        }
    }

    async goToCardsList() {
        await this.router.navigate(['/wallet/cards']);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
