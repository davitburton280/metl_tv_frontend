import {Component, OnInit} from '@angular/core';
import {StocksService} from '@core/services/stocks.service';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-stock-profile',
    templateUrl: './stock-profile.component.html',
    styleUrls: ['./stock-profile.component.scss']
})
export class StockProfileComponent implements OnInit {
    activeTab = 'summary';
    indices;
    selectedStock;
    stockInfo;
    dataLoading = 'idle';

    constructor(
        private stocksService: StocksService,
        public router: Router,
        private route: ActivatedRoute,
        private subject: SubjectService
    ) {
    }

    ngOnInit(): void {
        this.dataLoading = 'loading';
        this.subject.currentIndices.subscribe(dt => {
            if (dt.length > 0) {
                this.dataLoading = 'finished';
                this.indices = dt;
            }
        });
        this.selectedStock = this.route.snapshot?.params?.symbol?.toUpperCase();
    }


    changeTab(tab) {
        this.activeTab = tab;
    }

    openStockProfile(stock) {
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([`stocks/${stock}/analytics`])
        );
    }

}
