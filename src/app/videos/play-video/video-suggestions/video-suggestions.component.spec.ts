import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSuggestionsComponent } from './video-suggestions.component';

describe('VideoSuggestionsComponent', () => {
  let component: VideoSuggestionsComponent;
  let fixture: ComponentFixture<VideoSuggestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoSuggestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
