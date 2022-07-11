import {Component, OnInit} from '@angular/core';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {CustomersService} from '@core/services/wallet/customers.service';
import {AuthService} from '@core/services/auth.service';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-show-wallet-cards',
    templateUrl: './show-wallet-cards.component.html',
    styleUrls: ['./show-wallet-cards.component.scss']
})
export class ShowWalletCardsComponent implements OnInit {
    authUser;
    userCards;

    constructor(
        private getAuthUser: GetAuthUserPipe,
        private customersService: CustomersService,
        private subject: SubjectService,
        public auth: AuthService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        if (this.auth.loggedIn()) {
            this.getCards();
        }
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
