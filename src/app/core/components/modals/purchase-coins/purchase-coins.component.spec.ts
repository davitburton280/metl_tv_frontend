import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCoinsComponent } from './purchase-coins.component';

describe('PurchaseCoinsComponent', () => {
  let component: PurchaseCoinsComponent;
  let fixture: ComponentFixture<PurchaseCoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseCoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
