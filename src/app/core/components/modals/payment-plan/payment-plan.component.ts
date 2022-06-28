import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { STRIPE_CARD_OPTIONS_Custom, STRIPE_PUBLISHABLE_KEY } from '@core/constants/global';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { generateStripeCardData } from '@core/helpers/generate-stripe-card-data';
import { GetAuthUserPipe } from '@shared/pipes/get-auth-user.pipe';
import { User } from '@shared/models/user';
import { CustomersService } from '@core/services/wallet/customers.service';
import { PaymentsService } from '@core/services/wallet/payments.service';
import { CardsService } from '@core/services/cards.service';
import { LoaderService } from '@core/services/loader.service';

@Component({
  selector: 'app-payment-plan',
  templateUrl: './payment-plan.component.html',
  styleUrls: ['./payment-plan.component.scss']
})
export class PaymentPlanComponent implements OnInit, OnDestroy {

    castomCardParams = null;

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
      private cardService: CardsService
  ) { }

  ngOnInit(): void {
      this.authUser = this.getAuthUser.transform();
      console.log(this.data);
      this.plan = this.data.plan;
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
        console.log(card);
        if (event.target.checked) {
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

    async submitFormWolet() {
        console.log('submit ', this.cardForm);
        console.log('valid ', this.cardForm.get('firstName').valid);
        console.log('valid ', this.cardForm.get('lastName').valid);
        if (this.selectedCard) {
          console.log(this.selectedCard);
          return;
      } else {
          const fulName = this.cardForm.value.firstName + ' ' + this.cardForm.value.lastName;
          console.log(fulName);
          console.log(this.card.getCardNumber());
          this.stripeService
              .createToken(this.card.element, {name: fulName})
              .subscribe(result => {
                  console.log(result);
                  // const cardData = generateStripeCardData(result, this.authUser, fulName);
                  // this.cardService.createStripeCard(cardData).subscribe(dt => {
                  //     console.log(dt);
                  // });
                  // return;
                  const purchases = {
                      unit_amount: 0,
                      discount: this.plan.discount,
                      name: this.plan.title,
                  };
                  console.log(purchases);
                  console.log(this.plan.currency);

              });
      }
    }

    maxLengthInput(event, max) {
        event.target.value = event.target.value.slice(0, max);
        console.log(event.target.value);
    }

    completePurchaseWholeDivCompletePurchaseNextDiv() {
      if (!this.selectedCard) {
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
            isPlan: true,
            purchase: {
                unit_amount: this.plan.price,
                discount: this.plan?.discount,
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
                this.closedMathDialog(r);
                // if (this.castomCardParams) {
                //     this.customersService.removeStripeCard(this.castomCardParams).subscribe((d) => {
                //         console.log(d);
                //         this.castomCardParams = null;
                //     });
                // }
            });
        });
    }

    nextMatDialog() {
        this.completePurchase = !this.completePurchase;
    }

    closedMathDialog(data?) {
      this.dialogRef.close(data);
    }

    testConsole(e) {
        console.log(e);
    }

    ngOnDestroy(): void {
      if (this.castomCardParams) {
          this.customersService.removeStripeCard(this.castomCardParams).subscribe((d) => {
              console.log(d);
          });
      }
    }

}
