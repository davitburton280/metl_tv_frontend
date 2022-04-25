import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsFilterFormComponent } from './payments-filter-form.component';

describe('PaymentsFilterFormComponent', () => {
  let component: PaymentsFilterFormComponent;
  let fixture: ComponentFixture<PaymentsFilterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsFilterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
