import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoJsRecordComponent } from './video-js-record.component';

describe('VideoJsRecordComponent', () => {
  let component: VideoJsRecordComponent;
  let fixture: ComponentFixture<VideoJsRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoJsRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoJsRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
