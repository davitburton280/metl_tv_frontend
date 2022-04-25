import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoUrlTabComponent } from './video-url-tab.component';

describe('VideoUrlTabComponent', () => {
  let component: VideoUrlTabComponent;
  let fixture: ComponentFixture<VideoUrlTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoUrlTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoUrlTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
