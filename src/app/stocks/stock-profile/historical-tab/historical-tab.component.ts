import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {StocksService} from '@core/services/stocks.service';
import {MatTableDataSource} from '@angular/material/table';
import {normalizeColName} from '@core/helpers/normalizeTableColumnName';
import {MatPaginator} from '@angular/material/paginator';

@Component({
    selector: 'app-historical-tab',
    templateUrl: './historical-tab.component.html',
    styleUrls: ['./historical-tab.component.scss']
})
export class HistoricalTabComponent implements OnInit {
    @Input('selectedStock') selectedStock;

    displayedColumns: string[] = ['date', 'price', 'change', 'changePercent', 'open', 'volume'];
    tableData;
    paginationValues = [10, 25, 100];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private stocksService: StocksService
    ) {
    }

    ngOnInit(): void {
        this.stocksService.getStockHistoricalPrices({stock: this.selectedStock}).subscribe(dt => {
            this.tableData = new MatTableDataSource(dt.historical);
            this.tableData.paginator = this.paginator;
        });
    }

    normalizeColName(col): string {
        return normalizeColName(col);
    }

}
