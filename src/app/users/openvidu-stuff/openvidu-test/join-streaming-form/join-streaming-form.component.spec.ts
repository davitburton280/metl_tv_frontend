import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinStreamingFormComponent } from './join-streaming-form.component';

describe('JoinStreamingFormComponent', () => {
  let component: JoinStreamingFormComponent;
  let fixture: ComponentFixture<JoinStreamingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinStreamingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinStreamingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
