import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {  STRIPE_CARD_OPTIONS_Custom, STRIPE_PUBLISHABLE_KEY } from '@core/constants/global';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { generateStripeCardData } from '@core/helpers/generate-stripe-card-data';
import { GetAuthUserPipe } from '@shared/pipes/get-auth-user.pipe';
import { User } from '@shared/models/user';
import { CustomersService } from '@core/services/wallet/customers.service';
import { PaymentsService } from '@core/services/wallet/payments.service';
import { LoaderService } from '@core/services/loader.service';
import { SubjectService } from '@core/services/subject.service';
import { Subscription } from 'rxjs';
import { ApplyDiscountToPricePipe } from '@shared/pipes/apply-discount-to-price.pipe';

@Component({
  selector: 'app-payment-plan',
  templateUrl: './payment-plan.component.html',
  styleUrls: ['./payment-plan.component.scss']
})
export class PaymentPlanComponent implements OnInit, OnDestroy {

    castomCardParams = null;
    requireCardNumber = false;
    requireExpiry = false;
    requireCvv = false;
    paymentName = 'Stripe';

    typeQuantity = 'Type quantity';

    subscriptions: Subscription[] = [];

    monthArr = [];
    month = 1;
    isPlan = true;
    images = [];

    cardNumberValidation = {
        empty: true,
        error: undefined,
        errorMessage: 'Card Number Invalid'
    };

    expiryValidation = {
        empty: true,
        error: undefined,
        errorMessage: 'Card Expiry Invalid'
    };

    cvvValidation = {
        empty: true,
        error: undefined,
        errorMessage: 'Card CVV Invalid'
    };

    plan;
    cards;
    checkedCard = [];
    typeCreditCardInput = true;
    selectedCard = null;
    authUser: User;
    completePurchase = false;
    time = new Date();

    cardForm: FormGroup;
    @ViewChild('inputSelectCard') inputSelectCard;
    @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;

    cardOptions = STRIPE_CARD_OPTIONS_Custom;
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

    elementsOptions: StripeElementsOptions = {
        locale: 'es',
    };

  constructor(
      private dialogRef: MatDialogRef<PaymentPlanComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private stripeService: StripeService,
      private getAuthUser: GetAuthUserPipe,
      private paymentsService: PaymentsService,
      private customersService: CustomersService,
      public loader: LoaderService,
      private subject: SubjectService,
      private applyDiscount: ApplyDiscountToPricePipe
  ) {
      this.loader.formProcessing = false;
  }

  ngOnInit(): void {
      this.authUser = this.getAuthUser.transform();
      if (this.data.coin) {
          console.log(this.data);
          this.isPlan = false;
          this.images = this.data.coinImg;
          const plan = {
              title: this.data.purchase.name,
              card_text: '',
              img: '../../assets/img/bronzeFrame.png',
              price: this.data.purchase.unit_amount,
              currency: this.data.purchase.currency,
              monthArr: [],
              monthDiscount: {
                  [this.month]: this.data.purchase?.metadata?.discount || 0,
              }
          };
          const monthArr = [];
          this.plan = plan;
          this.monthArr = monthArr;
      } else {
          this.plan = this.data.plan;
          this.monthArr = this.data.plan.monthArr;
      }
      this.cards = this.data.cards;
      this.formBuilderCard();
      this.cardForm.enable();
      this.cards.forEach((elem) => {
          if (elem.is_primary === 1) {
              this.typeCreditCardInput = false;
              this.selectedCard = elem;
              this.checkedCard.push(true);
              const firstName = elem.holder_name.split(' ');
              this.cardForm.patchValue({
                  firstName: firstName[0],
                  lastName: firstName[1],
                  cardNumber: '**** **** **** ' + elem.number_part,
                  cardMonth: elem.exp_month,
                  cardYear: elem.exp_year,
                  cvv: '***'
              });
              this.cardForm.disable();
          }
          if (elem.is_primary === 0) {
              this.checkedCard.push(false);
          }
      });
  }

  formBuilderCard() {
      this.cardForm = new FormGroup({
          firstName: new FormControl('', [Validators.required]),
          lastName: new FormControl('', [Validators.required]),
          cardNumber: new FormControl('', [
              Validators.required,
              Validators.minLength(16),
              Validators.maxLength(19),
              // Validators.pattern('[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}')
          ]),
          cardMonth: new FormControl('', [Validators.required, Validators.maxLength(2)]),
          cardYear: new FormControl('', [Validators.required, Validators.maxLength(4)]),
          cvv: new FormControl('', [Validators.required, Validators.maxLength(3)]),
      });
  }

    selectCard(card, event, index) {
        this.checkedCard = [];
        this.cardForm.markAsUntouched();
        console.log(card);
        if (event.target.checked) {
            this.requireCardNumber = false;
            this.requireExpiry = false;
            this.requireCvv = false;
            this.selectedCard = card;
            this.typeCreditCardInput = false;
            this.cards.forEach(() => {
                this.checkedCard.push(false);
            });
            this.checkedCard[index] = true;
            console.log(this.checkedCard);
            const firstName = card.holder_name.split(' ');
            this.cardForm.patchValue({
                firstName: firstName[0],
                lastName: firstName[1],
                cardNumber: `**** **** **** ${card.number_part}`,
                cardMonth: card.exp_month,
                cardYear: card.exp_year,
                cvv: '***'
            });
            this.cardForm.disable();
        } else {
            this.selectedCard = null;
            this.cardForm.enable();
            this.typeCreditCardInput = true;
            this.cards.forEach(() => {
                this.checkedCard.push(false);
            });
            console.log(this.checkedCard);
            this.cardForm.patchValue({
                firstName: '',
                lastName: '',
                cardNumber: '',
                cardMonth: '',
                cardYear: '',
                cvv: ''
            });
        }
        console.log(this.cardForm);
    }

    maxLengthInput(event, max) {
        event.target.value = event.target.value.slice(0, max);
        console.log(event.target.value);
    }

    completePurchaseWholeDivCompletePurchaseNextDiv() {
        if (!this.selectedCard) {
          this.cardForm.markAllAsTouched();
          if (!this.cardForm.get('firstName').valid && !this.cardForm.get('lastName').valid
              || this.cardNumberValidation.empty || this.expiryValidation.empty || this.cvvValidation.empty
              || this.cardNumberValidation.error !== undefined
              || this.expiryValidation.error !== undefined
              || this.cvvValidation.error !== undefined) {
              if (this.cardNumberValidation.empty) {
                  this.requireCardNumber = true;
                  this.cardNumberValidation.errorMessage = 'Card Number Required';
              }
              if (this.expiryValidation.empty) {
                  this.requireExpiry = true;
                  this.expiryValidation.errorMessage = 'Card Expiry Required';
              }
              if (this.cvvValidation.empty) {
                  this.requireCvv = true;
                  this.cvvValidation.errorMessage = 'Card CVV Required';
              }
              return;
          }
          console.log(this.cardForm.get('firstName').valid);
          console.log(this.cardForm.get('lastName').valid);
          this.loader.formProcessing = true;
          const fulName = this.cardForm.value.firstName + ' ' + this.cardForm.value.lastName;
          this.stripeService
              .createToken(this.card.element, {name: fulName})
              .subscribe(result => {
                  console.log(result);
                  const cardData = generateStripeCardData(result, this.authUser, fulName);
                  this.customersService.createStripeCustomerCard(cardData).subscribe(async (dt: any) => {
                      this.loader.formProcessing = false;
                      this.nextMatDialog();
                      this.selectedCard = dt.filter(el => el.card_id === result.token.card.id)[0];
                      console.log(this.selectedCard);
                      this.castomCardParams = {
                          card_id: this.selectedCard.id,
                          stripe_customer_id: this.selectedCard.customer,
                          stripe_account_id: this.selectedCard.stripe_account_id || '',
                          user_id: this.authUser.id
                      };
                  });
              });
      } else {
            this.nextMatDialog();
            this.typeCreditCardInput = true;
            if (this.castomCardParams) {
                this.customersService.removeStripeCard(this.castomCardParams).subscribe((d) => {
                    console.log(d);
                    this.castomCardParams = null;
                });
            }
      }
    }

    createPaymentIntentPlan() {
        this.loader.formProcessing = true;
        this.paymentsService.createPaymentIntent({
            user_id: this.authUser.id,
            customer_id: this.selectedCard.stripe_customer_id,
            account_id: this.selectedCard.stripe_account_id,
            currency: this.plan.currency,
            card: this.selectedCard,
            isPlan: this.isPlan,
            purchase: {
                unit_amount: this.plan.price,
                discount: this.plan.monthDiscount[this.month],
                name: this.plan.title
            }
        }).subscribe(async (clientSecret) => {
            console.log('createPayment ', clientSecret);
            const stripe = await this.stripePromise;
            await stripe.confirmCardPayment(clientSecret, {
                payment_method: this.selectedCard.id
            }).catch(e => {
                console.log(e);
            }).then((r) => {
                console.log(r);
                console.log(this.castomCardParams);
                this.loader.formProcessing = false;
                this.closedMathDialog({
                    customer: this.selectedCard.stripe_customer_id,
                    payment: r
                });
            });
        });
    }

    nextMatDialog() {
        this.completePurchase = !this.completePurchase;
        this.requireCardNumber = false;
        this.requireExpiry = false;
        this.requireCvv = false;
    }

    changeCardNumber(e) {
        console.log(e);
        this.requireCardNumber = false;
        this.cardNumberValidation.empty = e.empty;
        this.cardNumberValidation.error = e.error;
        if (!e.empty) {
            this.cardNumberValidation.errorMessage = 'Card Number Invalid';
        }
    }

    changeExpiry(e) {
        this.requireExpiry = false;
        this.expiryValidation.empty = e.empty;
        this.expiryValidation.error = e.error;
        if (!e.empty) {
            this.expiryValidation.errorMessage = 'Card Expiry Invalid';
        }
    }

    changeCvv(e) {
        this.requireCvv = false;
        this.cvvValidation.empty = e.empty;
        this.cvvValidation.error = e.error;
        if (!e.empty) {
            this.cvvValidation.errorMessage = 'Card CVV Invalid';
        }
    }

    closedMathDialog(data?) {
      this.dialogRef.close(data);
    }

    monthCount(month) {
      this.month = month;
      this.typeQuantity = this.month + ' month';
    }

    totalPrice() {
      return Number(((this.plan.price * this.month) / 100).toFixed(2));
    }

    // totalPricePrcent() {
    //     const prc = Number(((this.plan.price * this.month) / 100).toFixed(2));
    //     return Number((prc - ((prc * this.plan.monthDiscount[this.month]) / 100)).toFixed(2));
    // }

    getDiscountedPrice() {
        return this.applyDiscount.transform(this.plan.price * this.month / 100, this.plan.monthDiscount[this.month])
            .toFixed(6).slice(0, -4);
    }

    payWith(str) {
      this.paymentName = str;
    }

    ngOnDestroy(): void {
      if (this.castomCardParams) {
          this.customersService.removeStripeCard(this.castomCardParams).subscribe((d) => {
              console.log(d);
          });
      }
    }

}
