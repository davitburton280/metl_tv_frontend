import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsPurchaseHistoryTabComponent } from './payments-purchase-history-tab.component';

describe('PaymentsPurchaseHistoryTabComponent', () => {
  let component: PaymentsPurchaseHistoryTabComponent;
  let fixture: ComponentFixture<PaymentsPurchaseHistoryTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsPurchaseHistoryTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsPurchaseHistoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
