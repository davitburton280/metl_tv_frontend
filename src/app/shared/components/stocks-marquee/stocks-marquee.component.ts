import {Component, Input, OnInit} from '@angular/core';
import trackByElement from '@core/helpers/track-by-element';
import {StocksListsModalComponent} from '@shared/components/stocks-lists-modal/stocks-lists-modal.component';
import {AuthService} from '@core/services/auth.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-stocks-marquee',
    templateUrl: './stocks-marquee.component.html',
    styleUrls: ['./stocks-marquee.component.scss']
})
export class StocksMarqueeComponent implements OnInit {
    @Input() stocks;
    @Input() videoStreaming = false;

    trackByElement = trackByElement;


    constructor(
        public auth: AuthService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
    }

    getPercentageDetails(stock) {
        const value = +stock.changesPercentage.replace(/[(%)]/g, '');
        return {...{value: value.toFixed(2)}, color: 'black-percent-' + (+value > 0 ? 'green' : 'red')};

    }

    openModal() {
        if (this.auth.loggedIn()) {
            this.dialog.open(StocksListsModalComponent, {
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%',
                panelClass: 'stocks-lists-modal'
            }).afterClosed().subscribe(dt => {
            });
        }
    }

}
