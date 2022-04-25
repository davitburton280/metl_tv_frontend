import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../constants/global';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userData;

    constructor(
        private httpClient: HttpClient,
        private jwtHelper: JwtHelperService,
    ) {
    }

    /**
     * Sends data for user registration
     * @param params user parameters
     */
    register(params) {
        return this.httpClient.post(`${API_URL}auth/register`, params);
    }

    /**
     * Checks to see if user logged in/ token expired
     */
    loggedIn() {
        return !this.jwtHelper.isTokenExpired();
    }

    login(params) {
        return this.httpClient.post<any>(`${API_URL}auth/login`, params);
    }

    sendEmailVerificationCode(params) {
        return this.httpClient.post<any>(`${API_URL}auth/send-verification-code`, params);
    }

    resendEmailVerificationCode(params) {
        return this.httpClient.post<any>(`${API_URL}auth/resend-verification-code`, params);
    }

    checkVerificationCode(params) {
        return this.httpClient.post<any>(`${API_URL}auth/check-verification-code`, params);
    }

    checkRoles(role: string, userData = null) {

        if (userData) {
            this.userData = userData;
        }
        if (this.loggedIn() && this.userData) {
            if ('role' in this.userData) {
                return this.userData.role.name.toLowerCase() === role;
            } else {

                return this.userData.roles.map(r => {
                    return (r.name.toLowerCase().replace(' ', '_') === role);
                }).some(Boolean);
            }
        }
        return false;
    }


    sendForgotPassEmail(params) {
        return this.httpClient.post<any>(`${API_URL}auth/send-forgot-pass-email`, params);
    }

    resetPass(params) {
        return this.httpClient.post<any>(`${API_URL}auth/reset-password`, params);
    }



    logout() {
        return this.httpClient.get(`${API_URL}auth/logout`);
    }
}
