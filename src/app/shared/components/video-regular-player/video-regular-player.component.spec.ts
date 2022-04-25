import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRegularPlayerComponent } from './video-regular-player.component';

describe('VideoRegularPlayerComponent', () => {
  let component: VideoRegularPlayerComponent;
  let fixture: ComponentFixture<VideoRegularPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoRegularPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoRegularPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
