import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinVideoStreamingComponent } from './join-video-streaming.component';

describe('JoinVideoStreamingComponent', () => {
  let component: JoinVideoStreamingComponent;
  let fixture: ComponentFixture<JoinVideoStreamingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinVideoStreamingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinVideoStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
