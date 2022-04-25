import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import {sortTableData} from '@core/helpers/sort-table-data-by-column';
import {MatPaginator} from '@angular/material/paginator';
import {Subject, Subscription} from 'rxjs';
import * as XLSX from 'xlsx';
import {GetWalletTablesColumnContentsPipe} from '@shared/pipes/get-wallet-tables-column-contents.pipe';
import {CapitalizeAddSpacesPipe} from '@shared/pipes/capitalize-add-spaces.pipe';

@Component({
    selector: 'app-mat-reusable-table',
    templateUrl: './mat-reusable-table.component.html',
    styleUrls: ['./mat-reusable-table.component.scss']
})
export class MatReusableTableComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    subscriptions: Subscription [] = [];

    tableData;
    pageSize = 5;
    pageIndex = 0;

    @Input() data = [];
    @Input() columns = [];
    @Input() tab;
    @Input() matSortActive = 'date';

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    filteredData = [];

    constructor(
        private getColumnContent: GetWalletTablesColumnContentsPipe,
        private capitalizeAddSpaces: CapitalizeAddSpacesPipe
    ) {
    }

    @Input() changing: Subject<string>;

    ngOnInit(): void {
        this.filterPayments();
        this.tableData = new MatTableDataSource(this.filteredData);
        this.tableData.paginator = this.paginator;
        this.tableData.sort = this.sort;
    }

    ngOnChanges() {
        this.filterPayments();
        this.tableData = new MatTableDataSource(this.filteredData);
        this.tableData.paginator = this.paginator;
        this.tableData.sort = this.sort;
    }

    handle(e) {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.filterPayments();
        this.tableData = new MatTableDataSource(this.filteredData);
    }

    filterPayments() {
        this.filteredData = this.data.slice(this.pageIndex * this.pageSize,
            this.pageIndex * this.pageSize + this.pageSize);
    }

    prepareDataForXls() {
        const contents = [];
        this.data.map((el, r) => {
            this.columns.map((col, index) => {
                if (index === 0) {
                    contents[r] = [];
                }
                const colName = this.capitalizeAddSpaces.transform(col);
                contents[r][colName] = this.getColumnContent.transform(col, el);
            });
        });
        return contents;
    }

    isSortableCol(col) {
        return ['date', 'initiated'].includes(col);
    }

    ngAfterViewInit() {

        if (this.changing) {

            // Exporting to Excel file from here (it exports all the pages of paginated table!!!)
            this.subscriptions.push(this.changing.subscribe((action) => {
                if (action === 'export') {
                    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.prepareDataForXls());
                    const wb: XLSX.WorkBook = {Sheets: {data: ws}, SheetNames: ['data']};
                    XLSX.writeFile(wb, 'Exported_File.xlsx');
                }
            }));
        }

        this.subscriptions.push(this.sort.sortChange.subscribe((sort: Sort) => {
            this.data = sortTableData(this.data, 'created', sort.direction);
            this.paginator.pageIndex = 0;
            this.filterPayments();
            this.tableData = new MatTableDataSource(this.filteredData);
        }));

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
