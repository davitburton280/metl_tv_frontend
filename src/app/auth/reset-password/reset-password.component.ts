import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {patternValidator} from '@core/helpers/pattern-validator';
import {EMAIL_PATTERN, NO_SPACE_PATTERN} from '@core/constants/patterns';
import {passwordConfirmation} from '@core/helpers/password-confirmation';
import {PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH} from '@core/constants/global';
import {AuthService} from '@core/services/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {ToastrService} from 'ngx-toastr';
import {LoaderService} from '@core/services/loader.service';
import {SubjectService} from '@core/services/subject.service';
import {UserStoreService} from '@core/services/stores/user-store.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    resetPassForm: FormGroup;
    isSubmitted = false;
    emailPassed = false;
    tokenExpired = false;
    email;

    constructor(
        private fb: FormBuilder,
        public router: Router,
        public auth: AuthService,
        private route: ActivatedRoute,
        private jwtHelper: JwtHelperService,
        private toastr: ToastrService,
        public loader: LoaderService,
        private userStore: UserStoreService
    ) {

        this.email = this.route.snapshot?.queryParams?.email;
        const token = this.route.snapshot?.queryParams?.token;
        this.tokenExpired = this.jwtHelper.isTokenExpired(token);
        this.emailPassed = !!this.email;

        this.resetPassForm = this.fb.group({
            email: [this.email, [Validators.required, patternValidator(EMAIL_PATTERN)]],
            password: ['',
                [
                    Validators.required, patternValidator(NO_SPACE_PATTERN),
                    Validators.minLength(PASSWORD_MIN_LENGTH), Validators.maxLength(PASSWORD_MAX_LENGTH)
                ],
            ],
            confirm_password: ['', [Validators.required]]
        }, {validator: passwordConfirmation('password', 'confirm_password')});
    }

    ngOnInit(): void {
    }

    changePassword() {
        this.isSubmitted = true;
        if (this.resetPassForm.valid) {
            this.auth.resetPass(this.resetPassForm.value).subscribe((async (dt) => {
                const token = dt.hasOwnProperty('token') ? dt?.token : '';
                if (token) {
                    localStorage.setItem('token', token);
                    this.userStore.setAuthUser(token);
                    await this.router.navigate(['/']);
                }

            }));
        }
    }

    resendEmail() {
        this.auth.sendForgotPassEmail({email: this.email}).subscribe(dt => {
            this.toastr.success('Reset password request has been resent to your e-mail');
        });
    }

    get pass(): AbstractControl {
        return this.resetPassForm.get('password');
    }

    get confirmPass(): AbstractControl {
        return this.resetPassForm.get('confirm_password');
    }

}
