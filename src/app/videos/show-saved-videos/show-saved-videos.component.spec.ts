import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSavedVideosComponent } from './show-saved-videos.component';

describe('ShowSavedVideosComponent', () => {
  let component: ShowSavedVideosComponent;
  let fixture: ComponentFixture<ShowSavedVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSavedVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSavedVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
