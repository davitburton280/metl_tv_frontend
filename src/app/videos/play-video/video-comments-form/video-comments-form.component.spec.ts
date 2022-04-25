import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCommentsFormComponent } from './video-comments-form.component';

describe('VideoCommentsFormComponent', () => {
  let component: VideoCommentsFormComponent;
  let fixture: ComponentFixture<VideoCommentsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoCommentsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCommentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
