import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StripeCardComponent, StripeService} from 'ngx-stripe';
import {StripeElementsOptions, loadStripe} from '@stripe/stripe-js';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STRIPE_CARD_OPTIONS, STRIPE_PUBLISHABLE_KEY} from '@core/constants/global';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {UsersService} from '@core/services/users.service';
import {CardsService} from '@core/services/cards.service';
import * as moment from 'moment';
import {SubjectService} from '@core/services/subject.service';
import {ToastrService} from 'ngx-toastr';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {LoaderService} from '@core/services/loader.service';
import {Subscription} from 'rxjs';


@Component({
    selector: 'app-complete-purchase-modal',
    templateUrl: './complete-purchase-modal.component.html',
    styleUrls: ['./complete-purchase-modal.component.scss']
})
export class CompletePurchaseModalComponent implements OnInit, OnDestroy {
    authUser;

    purchase;
    selectedCurrency = {name: 'USD', code: 'USD'};
    currentDate = new Date();

    creditCardForm: FormGroup;
    creditCardAdded = false;

    // Stripe
    cardOptions = STRIPE_CARD_OPTIONS;
    elementsOptions: StripeElementsOptions = {locale: 'en'};

    reviewedPurchase = false;
    selectedCard;
    userCards = [];
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

    @ViewChild(StripeCardComponent) card: StripeCardComponent;

    subscriptions: Subscription[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private matDialogRef: MatDialogRef<CompletePurchaseModalComponent>,
        private paymentsService: PaymentsService,
        private stripeService: StripeService,
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private usersService: UsersService,
        private cardsService: CardsService,
        private subject: SubjectService,
        private toastr: ToastrService,
        public loader: LoaderService
    ) {
        this.purchase = data;
        console.log(this.purchase);
        this.creditCardForm = fb.group({
            name: ['', [Validators.required]],
            price: data.unit_amount
        });
    }


    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.selectedCard = this.authUser?.users_cards.find(t => t.primary) || this.authUser?.users_cards[0];

        this.subscriptions.push(this.subject.currentUserCards.subscribe(dt => {
            this.userCards = dt;
        }));
        this.selectedCard = this.userCards.find(t => t.primary) || this.userCards[0];


    }

    createPaymentIntent() {
        this.loader.formProcessing = true;
        this.paymentsService.createPaymentIntent({
            user_id: this.authUser.id,
            customer_id: this.selectedCard.stripe_customer_id,
            account_id: this.selectedCard.stripe_account_id,
            currency: this.purchase.currency,
            card: this.selectedCard,
            purchase: {
                unit_amount: this.purchase.unit_amount,
                discount: this.purchase?.metadata?.discount,
                name: this.purchase.name
            }
        }).subscribe(async (clientSecret) => {
            console.log('createPayment ', clientSecret);
            const stripe = await this.stripePromise;
            await stripe.confirmCardPayment(clientSecret, {
                payment_method: this.selectedCard.id
            }).catch(e => {
                console.log(e);
            }).then((r) => {
                this.loader.formProcessing = false;
                this.toastr.success('The purchase has been completed successfully', 'Done!');
                this.closeModal({customer: this.selectedCard.stripe_customer_id});
            });
        });
    }

    formatExpiryDate(date) {
        return moment(date, 'MM/YYYY').format('MM/YY');
    }

    reviewPurchase() {
        this.reviewedPurchase = !this.reviewedPurchase;
    }

    selectCard(e) {
        this.selectedCard = this.userCards.find(t => t.name === e.target.value);
    }


    closeModal(dt) {
        this.matDialogRef.close(dt);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
