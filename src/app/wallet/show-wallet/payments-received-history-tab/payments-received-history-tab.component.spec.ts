import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsReceivedHistoryTabComponent } from './payments-received-history-tab.component';

describe('PaymentsReceivedHistoryTabComponent', () => {
  let component: PaymentsReceivedHistoryTabComponent;
  let fixture: ComponentFixture<PaymentsReceivedHistoryTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsReceivedHistoryTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsReceivedHistoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
