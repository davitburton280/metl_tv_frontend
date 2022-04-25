import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletePurchaseModalComponent } from './complete-purchase-modal.component';

describe('CompletePurchaseModalComponent', () => {
  let component: CompletePurchaseModalComponent;
  let fixture: ComponentFixture<CompletePurchaseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletePurchaseModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletePurchaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
