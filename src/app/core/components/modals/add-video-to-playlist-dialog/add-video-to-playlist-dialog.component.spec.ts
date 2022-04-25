import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoToPlaylistDialogComponent } from './add-video-to-playlist-dialog.component';

describe('AddVideoToPlaylistDialogComponent', () => {
  let component: AddVideoToPlaylistDialogComponent;
  let fixture: ComponentFixture<AddVideoToPlaylistDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVideoToPlaylistDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVideoToPlaylistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
