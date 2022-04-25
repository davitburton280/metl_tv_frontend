import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {patternValidator} from '@core/helpers/pattern-validator';
import {EMAIL_PATTERN, TEXT_ONLY_PATTERN_WITHOUT_SPECIALS} from '@core/constants/patterns';
import {Subscription} from 'rxjs';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {UsersService} from '@core/services/users.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import UsStates from '@core/constants/us_states.json';
import MccCodes from '@core/constants/mcc_codes.json';
import * as moment from 'moment';
import {ALLOWED_COUNTRIES, DEFAULT_COUNTRY, STRIPE_CARD_OPTIONS, STRIPE_PUBLISHABLE_KEY} from '@core/constants/global';
import {loadStripe, StripeElementsOptions} from '@stripe/stripe-js';
import {StripeCardComponent, StripeService} from 'ngx-stripe';
import {AccountsService} from '@core/services/wallet/accounts.service';
import {LoaderService} from '@core/services/loader.service';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-save-bank-account',
    templateUrl: './save-bank-account.component.html',
    styleUrls: ['./save-bank-account.component.scss']
})
export class SaveBankAccountComponent implements OnInit, OnDestroy {

    stripeBankAccountForm: FormGroup;
    isSubmitted = false;
    subscriptions: Subscription[] = [];
    authUser;
    UsStates = UsStates;
    MccCodes = MccCodes;
    maxBirthDate: Date;
    currentDate = new Date();

    // Stripe
    cardOptions = STRIPE_CARD_OPTIONS;
    elementsOptions: StripeElementsOptions = {locale: 'en'};

    externalAccountType = 'bank_account';

    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);


    @ViewChild(StripeCardComponent, {static: true}) card: StripeCardComponent;

    allowedCountries = ALLOWED_COUNTRIES;
    defaultCountry = DEFAULT_COUNTRY;

    stripeAccountExists = 0;

    constructor(
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private usersService: UsersService,
        private accountsService: AccountsService,
        private toastr: ToastrService,
        private stripeService: StripeService,
        private subject: SubjectService,
        public loader: LoaderService,
        public router: Router
    ) {
        this.authUser = this.getAuthUser.transform();

        // Age-restriction of 18
        this.maxBirthDate = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() - 18));


    }

    ngOnInit(): void {

        this.initForm();
        this.checkIfUserHasStripeAccount();

    }

    checkIfUserHasStripeAccount() {
        this.accountsService.checkIfUserHasStripeAccount({user_id: this.authUser.id}).subscribe(exists => {
            this.stripeAccountExists = exists;
        });
    }

    initForm() {
        this.stripeBankAccountForm = this.fb.group({
            user_id: this.authUser.id,
            email: ['', [Validators.required, patternValidator(EMAIL_PATTERN)]],
            individual: this.fb.group({
                first_name: ['', [Validators.required, patternValidator(TEXT_ONLY_PATTERN_WITHOUT_SPECIALS)]],
                last_name: ['', [Validators.required, patternValidator(TEXT_ONLY_PATTERN_WITHOUT_SPECIALS)]],
                email: ['', [Validators.required, patternValidator(EMAIL_PATTERN)]],
                dob: this.fb.group({
                    day: ['', Validators.required],
                    month: ['', Validators.required],
                    year: ['', Validators.required],
                }),
                phone: ['000 000 0000', Validators.required],
                id_number: ['000000000', Validators.required],
                address: this.fb.group({
                    country: ['US', Validators.required],
                    city: ['New York', Validators.required],
                    state: ['New York', Validators.required],
                    line1: ['13 Street', Validators.required],
                    line2: ['47 W', Validators.required],
                    postal_code: ['10001', Validators.required],
                })
            }),
            business_profile: this.fb.group({
                mcc: ['7929', Validators.required],
                url: ['https://metl.tv/', Validators.required],
            }),
            external_account: this.fb.group({
                object: ['bank_account'],
                country: ['US', Validators.required],
                routing_number: ['110000000', Validators.required],
                account_number: ['000123456789', Validators.required],
            })
        });

        this.stripeBankAccountForm.patchValue({individual: this.authUser, email: this.authUser.email});

        const year = moment(this.authUser.birthday).format('Y');
        const month = moment(this.authUser.birthday).format('MM');
        const day = moment(this.authUser.birthday).format('DD');
        this.individual.controls.dob.patchValue({year, month, day});
    }

    async getExternalAccountData(type) {

        // // if (type === 'bank_account') {
        // return this.fb.group({
        //     object: [type],
        //     country: ['US', Validators.required],
        //     routing_number: ['110000000', Validators.required],
        //     account_number: ['000123456789', Validators.required],
        //     confirm_account_number: ['', Validators.required]
        // });
    }

    dateChanged(e) {
        const year = e.getFullYear();
        const month = e.getMonth();
        const day = e.getDay();
        this.individual.controls.dob.patchValue({year, month, day});
    }

    async saveBankAccount() {
        let formValue = this.stripeBankAccountForm.value;
        this.loader.formProcessing = true;
        if (this.externalAccountType === 'debit_card') {
            this.stripeService.createToken(this.card.element, {
                name: this.authUser.first_name + ' ' + this.authUser.last_name,
                currency: 'usd'
            }).subscribe(result => {
                const {external_account, ...restData} = this.stripeBankAccountForm.getRawValue();

                formValue = {
                    ...restData,
                    external_account: result.token.id,
                    customer_id: this.subject.currentUserCards?.[0].customer
                };
                this.addExternalAccount(formValue);
            });
        } else {
            this.stripeService.createToken('bank_account', formValue.external_account).subscribe(result => {
                this.addExternalAccount({
                    external_account: result.token.id,
                    customer_id: this.subject.currentUserCards?.[0].customer,
                    ...this.stripeBankAccountForm.getRawValue()
                });
            });
        }
    }

    addExternalAccount(formValue) {
        this.accountsService.addStripeExternalAccount(formValue).subscribe(async (dt) => {
            this.loader.formProcessing = false;
            this.subject.changeUserCards(dt);
            await this.router.navigate(['wallet/show']);
            this.toastr.success('The bank account has been added successfully');
        });
    }

    phoneChanged(e) {
        this.stripeBankAccountForm.patchValue({phone: e.target.value});
    }

    get firstName(): AbstractControl {
        return this.stripeBankAccountForm.get('first_name');
    }

    get lastName(): AbstractControl {
        return this.stripeBankAccountForm.get('last_name');
    }

    get email(): AbstractControl {
        return this.stripeBankAccountForm.get('email');
    }

    get birthday(): AbstractControl {
        return this.stripeBankAccountForm.get('birthday');
    }

    get individual(): any {
        return this.stripeBankAccountForm.controls.individual as any;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
