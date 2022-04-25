import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetlCoinsPayoutScheduleTabComponent } from './metl-coins-payout-schedule-tab.component';

describe('MetlCoinsPayoutScheduleTabComponent', () => {
  let component: MetlCoinsPayoutScheduleTabComponent;
  let fixture: ComponentFixture<MetlCoinsPayoutScheduleTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetlCoinsPayoutScheduleTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetlCoinsPayoutScheduleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
