import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {ProductsService} from '@core/services/wallet/products.service';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {Subscription} from 'rxjs';
import {ApplyDiscountToPricePipe} from '@shared/pipes/apply-discount-to-price.pipe';

@Component({
    selector: 'app-purchase-bits',
    templateUrl: './purchase-bits.component.html',
    styleUrls: ['./purchase-bits.component.scss']
})
export class PurchaseBitsComponent implements OnInit, OnDestroy {

    bitProducts = [];
    subscriptions: Subscription[] = [];

    coinImages = ['gold', 'silver', 'pink', 'green', 'blue'];
    authUser;

    @Input() totals;
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

    getStripeProducts(){
        this.subscriptions.push(this.productsService.getStripeProducts().subscribe(dt => {
            this.bitProducts = dt;
        }));
    }

    openPurchaseModal(purchase) {
        console.log(this.bitProducts);
        console.log(this.totals);
        this.subscriptions.push(this.dialog.open(CompletePurchaseModalComponent, {
            data: purchase,
            width: '800px'
        }).afterClosed().subscribe((dt) => {
            if (dt) {
                this.subscriptions.push(this.paymentsService.getAllPaymentsHistory({user_id: this.authUser.id, ...dt}).subscribe(ph => {
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

    createArray(len) {
        return new Array(len < 1 ? 1 : len);
    }

    closed() {
        this.closeDropDownMenu.emit();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
