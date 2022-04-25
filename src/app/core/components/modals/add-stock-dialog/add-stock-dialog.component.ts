import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-add-stock-dialog',
    templateUrl: './add-stock-dialog.component.html',
    styleUrls: ['./add-stock-dialog.component.scss']
})
export class AddStockDialogComponent implements OnInit {
    addStockForm: FormGroup;

    constructor(
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
    }

}
