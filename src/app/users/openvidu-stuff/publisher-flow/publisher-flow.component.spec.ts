import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherFlowComponent } from './publisher-flow.component';

describe('PublisherFlowComponent', () => {
  let component: PublisherFlowComponent;
  let fixture: ComponentFixture<PublisherFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublisherFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
