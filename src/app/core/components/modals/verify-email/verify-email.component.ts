import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '@core/services/auth.service';
import {patternValidator} from '@core/helpers/pattern-validator';
import {FOUR_DIGIT_NUMBERS_ONLY, NUMBERS_ONLY} from '@core/constants/patterns';
import {LoaderService} from '@core/services/loader.service';
import {Router} from '@angular/router';
import {PASSWORD_MIN_LENGTH} from '@core/constants/global';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
    email = '';
    verifyCodeForm: FormGroup;
    sentCode: number;
    codeChecked = false;
    verifyingCode = false;
    codeWrong = false;
    codeResent = false;
    codeResending = false;
    isSubmitted = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private matDialogRef: MatDialogRef<VerifyEmailComponent>,
        private fb: FormBuilder,
        private auth: AuthService,
        public loader: LoaderService,
        public router: Router
    ) {
        this.sentCode = data.code;
        this.email = data.email;
        this.verifyCodeForm = this.fb.group({
            email: [this.email, Validators.required],
            code: [null, [
                Validators.required, patternValidator(NUMBERS_ONLY),
                patternValidator(FOUR_DIGIT_NUMBERS_ONLY)
            ]]
        });
    }

    ngOnInit(): void {
    }

    verifyCode() {
        this.isSubmitted = true;
        if (this.verifyCodeForm.valid) {
            this.loader.formProcessing = true;
            this.auth.checkVerificationCode(this.verifyCodeForm.value).subscribe(async (dt) => {
                this.codeChecked = true;
                this.verifyingCode = false;
                this.loader.formProcessing = false;
                setTimeout(() => {
                    this.matDialogRef.close(dt);
                }, 4000);

            });

        }
    }

    resendCode() {
        this.codeResending = true;
        this.codeWrong = false;
        this.auth.resendEmailVerificationCode({email: this.email, resend: 1}).subscribe(code => {
            this.sentCode = code;
            this.codeResending = false;
            this.codeResent = true;
        });
    }

    get emailCtrl(): AbstractControl {
        return this.verifyCodeForm.get('email');
    }

    get codeCtrl(): AbstractControl {
        return this.verifyCodeForm.get('code');
    }

}
