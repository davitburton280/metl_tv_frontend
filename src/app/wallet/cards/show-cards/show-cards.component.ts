import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Card} from '@shared/models/card';
import {User} from '@shared/models/user';
import {Subscription} from 'rxjs';
import {LoaderService} from '@core/services/loader.service';
import {SubjectService} from '@core/services/subject.service';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {CustomersService} from '@core/services/wallet/customers.service';
import {MAX_CARDS_PER_USER} from '@core/constants/global';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-show-cards',
    templateUrl: './show-cards.component.html',
    styleUrls: ['./show-cards.component.scss']
})
export class ShowCardsComponent implements OnInit, OnDestroy {
    userCards: Card[] = [];
    selectedCard: Card;
    authUser: User;
    subscriptions: Subscription[] = [];

    showActions = false;

    maxCardsPerUser = MAX_CARDS_PER_USER;
    makingPrimary = false;


    constructor(
        public loader: LoaderService,
        public router: Router,
        private subject: SubjectService,
        private customersService: CustomersService,
        private getAuthUser: GetAuthUserPipe,
        // private changeDetection: ChangeDetectionStrategy.OnPush
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getCustomerCards();
    }

    getCustomerCards() {
        this.subscriptions.push(this.subject.currentUserCards.subscribe(dt => {
            this.userCards = dt;
        }));
        this.loader.dataLoading = true;
        this.customersService.getUserCards({user_id: this.authUser.id}).subscribe(dt => {
            this.userCards = dt;
            this.subject.changeUserCards(dt);
            this.loader.dataLoading = false;
        });
    }

    formatExpiryDate(date) {
        return moment(date, 'MM/YYYY').format('MM/YY');
    }

    getBgClass(i) {
        return i === 0 ? 'bg-green' : (i === 1 ? 'bg-gold' : 'bg-gray');
    }

    makePrimary(c) {
        this.makingPrimary = true;
        this.subscriptions.push(this.customersService.makePrimary({
            card_id: c.id,
            stripe_customer_id: c.customer,
            user_id: this.authUser.id
        }).subscribe(dt => {
            this.makingPrimary = false;
            this.userCards = dt;
        }));
    }

    toggleActions(card, showActions) {
        this.showActions = showActions;
        if (showActions) {
            this.selectedCard = card;
        }
    }

    async editCard(c) {
        await this.router.navigate([`/wallet/cards/edit/${c.id}`]);
    }

    removeCard(card) {
        this.loader.dataLoading = true;
        const params = {
            card_id: card.id,
            stripe_customer_id: card.customer,
            stripe_account_id: card.stripe_account_id || '',
            user_id: this.authUser.id
        };
        this.subscriptions.push(this.customersService.removeStripeCard(params).subscribe((dt: any) => {
            this.subject.changeUserCards(dt);
            this.userCards = dt;
            this.loader.dataLoading = false;
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
