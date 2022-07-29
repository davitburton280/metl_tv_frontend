import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '@core/services/auth.service';
import {passwordConfirmation} from '@core/helpers/password-confirmation';
import {DatePipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {VerifyEmailComponent} from '@core/components/modals/verify-email/verify-email.component';
import {
    EMAIL_PATTERN,
    NO_SPACE_PATTERN,
    NUMBER_AFTER_TEXT_PATTERN,
    TEXT_ONLY_PATTERN_WITHOUT_SPECIALS
} from '@core/constants/patterns';
import {patternValidator} from '@core/helpers/pattern-validator';
import {PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH} from '@core/constants/global';
import {LoaderService} from '@core/services/loader.service';
import {SubjectService} from '@core/services/subject.service';
import moment from 'moment';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    subscriptions: Subscription[] = [];
    isSubmitted = false;
    currentDate = new Date();
    maxDate: Date;

    constructor(
        public router: Router,
        private fb: FormBuilder,
        private auth: AuthService,
        private datePipe: DatePipe,
        private dialog: MatDialog,
        public loader: LoaderService,
        private subject: SubjectService,
        private userStore: UserStoreService,
        private _userInfoService: UserInfoService
    ) {

        // Age-restriction of 18
        this.maxDate = new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() - 18));
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.registerForm = this.fb.group({
                first_name: ['', [Validators.required, patternValidator(TEXT_ONLY_PATTERN_WITHOUT_SPECIALS)]],
                last_name: ['', [Validators.required, patternValidator(TEXT_ONLY_PATTERN_WITHOUT_SPECIALS)]],
                username: ['', [Validators.required, patternValidator(NUMBER_AFTER_TEXT_PATTERN)]],
                email: ['', [Validators.required, patternValidator(EMAIL_PATTERN)]],
                password: ['',
                    [
                        Validators.required, patternValidator(NO_SPACE_PATTERN),
                        Validators.minLength(PASSWORD_MIN_LENGTH), Validators.maxLength(PASSWORD_MAX_LENGTH)
                    ],
                ],
                // confirm_password: new FormControl('', {validators: [Validators.required], updateOn: 'blur'}),
                confirm_password: ['', Validators.required],
                birthday: [moment().format('YYYY-MM-DD')], // Validators.required
            },
            {validator: passwordConfirmation('password', 'confirm_password')}
        );
    }

    register() {
        if (this.registerForm.valid) {
            this.loader.formProcessing = true;
            this.subscriptions.push(this.auth.register(this.registerForm.value).subscribe(async (dt: any) => {
                this.loader.formProcessing = false;
                localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
                this.userStore.setAuthUser((dt.hasOwnProperty('token') ? dt.token : ''));
                const token = dt?.token;
                if (token) {
                    localStorage.setItem('token', token);
                    this.userStore.setAuthUser(token);
                    this._userInfoService._getCurrentUserInfo();
                }
                await this.router.navigate(['/']);
            }));
        }
    }

    dateChanged(e) {

    }

    openModal() {
        this.isSubmitted = true;

        if (this.registerForm.valid) {

            this.loader.formProcessing = true;
            this.subscriptions.push(this.auth.sendEmailVerificationCode(this.registerForm.value).subscribe((code) => {
                this.loader.formProcessing = false;
                this.dialog.open(VerifyEmailComponent, {
                    height: '548px',
                    width: '548px',
                    data: this.registerForm.value
                }).afterClosed().subscribe(async (dt) => {
                    localStorage.setItem('token', (dt?.hasOwnProperty('token') ? dt.token : ''));
                    await this.router.navigate(['/']);
                });
            }));
        }


    }

    get firstName(): AbstractControl {
        return this.registerForm.get('first_name');
    }

    get lastName(): AbstractControl {
        return this.registerForm.get('last_name');
    }

    get email(): AbstractControl {
        return this.registerForm.get('email');
    }

    get pass(): AbstractControl {
        return this.registerForm.get('password');
    }

    get username(): AbstractControl {
        return this.registerForm.get('username');
    }

    get confirmPass(): AbstractControl {
        return this.registerForm.get('confirm_password');
    }

    get birthday(): AbstractControl {
        return this.registerForm.get('birthday');
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
