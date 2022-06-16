import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionChanelComponent } from './subscription-chanel.component';

describe('SubscriptionChanelComponent', () => {
  let component: SubscriptionChanelComponent;
  let fixture: ComponentFixture<SubscriptionChanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionChanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionChanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
