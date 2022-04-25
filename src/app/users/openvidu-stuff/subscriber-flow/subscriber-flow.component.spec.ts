import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberFlowComponent } from './subscriber-flow.component';

describe('SubscriberFlowComponent', () => {
  let component: SubscriberFlowComponent;
  let fixture: ComponentFixture<SubscriberFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
