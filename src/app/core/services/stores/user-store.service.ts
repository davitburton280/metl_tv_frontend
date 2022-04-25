import {Injectable} from '@angular/core';
import jwtDecode from 'jwt-decode';
import {BehaviorSubject} from 'rxjs';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';

@Injectable({
    providedIn: 'root'
})
export class UserStoreService {
    token = localStorage.getItem('token');
    authUserData = this.token ? jwtDecode(this.token) : {};
    private authUserSource = new BehaviorSubject(this.authUserData);

    authUser$ = this.authUserSource.asObservable();

    constructor(
        private isEmptyObj: CheckForEmptyObjectPipe
    ) {
    }

    get authUser() {
        return this.authUserSource.getValue();
    }

    setAuthUser(token) {
        let data;
        if (token) {
            data = jwtDecode(token);
            this.authUserSource.next(data);
        }
    }

    isAuthenticated() {
        return !this.isEmptyObj.transform(this.authUser);
    }
}
