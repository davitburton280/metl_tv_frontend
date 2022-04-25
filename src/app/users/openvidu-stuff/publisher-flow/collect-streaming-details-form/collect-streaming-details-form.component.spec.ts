import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectStreamingDetailsFormComponent } from './collect-streaming-details-form.component';

describe('CollectStreamingDetailsFormComponent', () => {
  let component: CollectStreamingDetailsFormComponent;
  let fixture: ComponentFixture<CollectStreamingDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectStreamingDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectStreamingDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
