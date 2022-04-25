import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCommentsListComponent } from './video-comments-list.component';

describe('VideoCommentsListComponent', () => {
  let component: VideoCommentsListComponent;
  let fixture: ComponentFixture<VideoCommentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoCommentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCommentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
