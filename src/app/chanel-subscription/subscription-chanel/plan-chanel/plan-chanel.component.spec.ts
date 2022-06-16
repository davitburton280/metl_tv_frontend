import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanChanelComponent } from './plan-chanel.component';

describe('PlanChanelComponent', () => {
  let component: PlanChanelComponent;
  let fixture: ComponentFixture<PlanChanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanChanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanChanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
