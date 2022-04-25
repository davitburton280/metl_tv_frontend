import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBitsComponent } from './purchase-bits.component';

describe('PurchaseBitsComponent', () => {
  let component: PurchaseBitsComponent;
  let fixture: ComponentFixture<PurchaseBitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseBitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseBitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
