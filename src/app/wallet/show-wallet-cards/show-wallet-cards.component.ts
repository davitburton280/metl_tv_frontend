import {Component, OnInit} from '@angular/core';
import {CustomersService} from '@core/services/wallet/customers.service';
import {AuthService} from '@core/services/auth.service';
import {SubjectService} from '@core/services/subject.service';
import {CurrentUserData} from '@core/interfaces';
import {UserInfoService} from '@core/services/user-info.service';

@Component({
    selector: 'app-show-wallet-cards',
    templateUrl: './show-wallet-cards.component.html',
    styleUrls: ['./show-wallet-cards.component.scss']
})
export class ShowWalletCardsComponent implements OnInit {
    authUser: CurrentUserData;
    userCards;

    constructor(
        // private getAuthUser: GetAuthUserPipe,
        private _userInfoService: UserInfoService,
        private customersService: CustomersService,
        private subject: SubjectService,
        public auth: AuthService
    ) {
        this._getAuthInfo();
    }

    ngOnInit(): void {
        // this.authUser = this.getAuthUser.transform();
        if (this.auth.loggedIn()) {
            this.getCards();
        }
    }

    private _getAuthInfo() {
        this._userInfoService._userInfo.subscribe((data) => {
            this.authUser = data;
            console.log(this.authUser, 'WALLET Show wallet CARDS AUTHUSER DATA');
        });
    }

    getCards() {
        this.customersService.getUserCards({user_id: this.authUser.id}).subscribe(dt => {
            this.userCards = dt;
            this.subject.changeUserCards(dt);
        });
    }

    removeCard(card) {
        const params = {
            card_id: card.id,
            stripe_customer_id: card.customer,
            stripe_account_id: card.stripe_account_id || '',
            user_id: this.authUser.id
        };
        this.customersService.removeStripeCard(params).subscribe((dt: any) => {
            this.userCards = dt;
            this.subject.changeUserCards(dt);
        });
    }

}
