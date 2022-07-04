import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompletePurchaseModalComponent } from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import { GetAuthUserPipe } from '@shared/pipes/get-auth-user.pipe';
import { SubjectService } from '@core/services/subject.service';
import { ProductsService } from '@core/services/wallet/products.service';
import { PaymentsService } from '@core/services/wallet/payments.service';
import { Subscription } from 'rxjs';
import { ApplyDiscountToPricePipe } from '@shared/pipes/apply-discount-to-price.pipe';
import { PaymentPlanComponent } from '@core/components/modals/payment-plan/payment-plan.component';
import { COIN_IMAGE_NAME } from '@core/constants/global';

@Component({
    selector: 'app-purchase-bits',
    templateUrl: './purchase-bits.component.html',
    styleUrls: ['./purchase-bits.component.scss']
})
export class PurchaseBitsComponent implements OnInit, OnDestroy {

    bitProducts = [];

    subscriptions: Subscription[] = [];

    coinImages = COIN_IMAGE_NAME;
    authUser;

    @Input() totals;
    @Input() card;
    @Output('closeDropDownMenu') closeDropDownMenu = new EventEmitter();

    constructor(
        private dialog: MatDialog,
        private productsService: ProductsService,
        private paymentsService: PaymentsService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private applyDiscount: ApplyDiscountToPricePipe
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getStripeProducts();

    }

    getStripeProducts() {
        this.subscriptions.push(this.productsService.getStripeProducts().subscribe(dt => {
            this.bitProducts = dt;
        }));
    }

    openPurchaseModal(purchase) {
        console.log(this.bitProducts);
        console.log(this.totals);
        this.subscriptions.push(this.dialog.open(PaymentPlanComponent, {
            data: {
                coin: true,
                purchase,
                cards: this.card,
                coinImg: this.createArrayCoinImg(purchase.name)
            },
            width: '1085px'
        }).afterClosed().subscribe((dt) => {
            if (dt) {
                this.subscriptions.push(this.paymentsService.getAllPaymentsHistory({ user_id: this.authUser.id, ...dt }).subscribe(ph => {
                    this.totals = ph.user_coins;
                    this.subject.setAllPaymentsData(ph);
                    this.subject.changePaymentsData(ph);
                }));
            }
        }));
    }

    getDiscountedPrice(product) {
        return this.applyDiscount.transform(product.unit_amount / 100, product?.metadata?.discount)
            .toFixed(6).slice(0, -4);
    }

    createArrayCoinImg(name) {
        let length = 0;
        const arr = [];
        switch (name) {
            case '100 bits':
                length = 2;
                break;
                case '300 bits':
                length = 3;
                break;
            case '800 bits':
                length = 4;
                break;
            default:
                length = 5;
        }
        for (let j = 0; j < length; j++) {
            arr.push(this.coinImages[j]);
        }
        return arr;
    }

    closed() {
        this.closeDropDownMenu.emit();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
