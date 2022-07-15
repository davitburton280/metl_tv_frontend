import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '@core/services/auth.service';
import {Subscription} from 'rxjs';
import {patternValidator} from '@core/helpers/pattern-validator';
import {AuthGuard} from '@core/guards/auth.guard';
import {EMAIL_PATTERN} from '@core/constants/patterns';
import {MatDialog} from '@angular/material/dialog';
import {SubjectService} from '@core/services/subject.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    subscriptions: Subscription[] = [];
    isSubmitted = false;

    constructor(
        public router: Router,
        private fb: FormBuilder,
        private auth: AuthService,
        private authGuard: AuthGuard,
        private dialog: MatDialog,
        private subject: SubjectService,
        private userStore: UserStoreService,
        private socketService: SocketIoService,
        private _userInfoService: UserInfoService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, patternValidator(EMAIL_PATTERN)]],
            password: ['', Validators.required],
        });

    }

    ngOnInit(): void {
    }

    login() {
        this.isSubmitted = true;
        if (this.loginForm.valid) {
            this.subscriptions.push(this.auth.login(this.loginForm.value).subscribe(async (dt: any) => {
                const token = dt?.token;
                if (token) {
                    localStorage.setItem('token', token);
                    this.userStore.setAuthUser(token);
                    this._userInfoService._getCurrentUserInfo();
                }

                await this.router.navigateByUrl(this.authGuard.redirectUrl || '/');
            }));
        }
    }


    get email(): AbstractControl {
        return this.loginForm.get('email');
    }

    get pass(): AbstractControl {
        return this.loginForm.get('password');
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
