import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-completed',
  templateUrl: './payment-completed.component.html',
  styleUrls: ['./payment-completed.component.scss']
})
export class PaymentCompletedComponent implements OnInit {

  constructor(
      private dialogRef: MatDialogRef<PaymentCompletedComponent>,
  ) { }

  ngOnInit(): void {
  }

  closed() {
      this.dialogRef.close();
  }

}
