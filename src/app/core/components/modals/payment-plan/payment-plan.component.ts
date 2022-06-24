import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { STRIPE_CARD_OPTIONS_Custom } from '@core/constants/global';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { generateStripeCardData } from '@core/helpers/generate-stripe-card-data';
import { GetAuthUserPipe } from '@shared/pipes/get-auth-user.pipe';
import { User } from '@shared/models/user';
import { CustomersService } from '@core/services/wallet/customers.service';

@Component({
  selector: 'app-payment-plan',
  templateUrl: './payment-plan.component.html',
  styleUrls: ['./payment-plan.component.scss']
})
export class PaymentPlanComponent implements OnInit {

    plan;
    cards;
    checkedCard = [];
    typeCreditCardInput = true;
    selectedCard = null;
    authUser: User;

    cardForm: FormGroup;
    @ViewChild('inputSelectCard') inputSelectCard;
    @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;

    cardOptions = STRIPE_CARD_OPTIONS_Custom;

    elementsOptions: StripeElementsOptions = {
        locale: 'es',
    };

  constructor(
      private dialogRef: MatDialogRef<PaymentPlanComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private stripeService: StripeService,
      private getAuthUser: GetAuthUserPipe,
      private customersService: CustomersService,
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

    submitFormWolet() {
        console.log('submit ', this.cardForm);
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
                  // console.log(this.plan);
                  const purchase = {
                      price: this.plan.price,
                      discount: this.plan.discount,
                      name: this.plan.title
                  };
                  console.log(purchase);
                  // const cardData = generateStripeCardData(result, this.authUser, fulName);
                  // console.log(cardData);
                  // this.customersService.createStripeCustomerCard(cardData).subscribe(async (dt: any) => {
                  //     console.log(dt);
                  //     let card;
                  //     dt.forEach((el) => {
                  //         if (el.card_id === result.token.card.id) {
                  //             card = el;
                  //         }
                  //     });
                  //     console.log(card);
                  //     const params = {
                  //         card_id: card.id,
                  //         stripe_customer_id: card.customer,
                  //         stripe_account_id: card.stripe_account_id || '',
                  //         user_id: this.authUser.id
                  //     };
                  //     this.customersService.removeStripeCard(params).subscribe((data: any) => {
                  //         console.log(data);
                  //     });
                  // });
              });
      }
    }

    maxLengthInput(event, max) {
        event.target.value = event.target.value.slice(0, max);
        console.log(event.target.value);
    }

    closedMathDialog() {
      this.dialogRef.close();
    }

}
