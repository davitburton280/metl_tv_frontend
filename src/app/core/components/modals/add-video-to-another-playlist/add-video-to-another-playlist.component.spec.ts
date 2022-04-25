import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideoToAnotherPlaylistComponent } from './add-video-to-another-playlist.component';

describe('AddVideoToAnotherPlaylistComponent', () => {
  let component: AddVideoToAnotherPlaylistComponent;
  let fixture: ComponentFixture<AddVideoToAnotherPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVideoToAnotherPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVideoToAnotherPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
