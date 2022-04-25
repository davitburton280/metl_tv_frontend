import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckStreamingRequirementsComponent } from './check-streaming-requirements.component';

describe('CheckStreamingRequirementsComponent', () => {
  let component: CheckStreamingRequirementsComponent;
  let fixture: ComponentFixture<CheckStreamingRequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckStreamingRequirementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckStreamingRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
