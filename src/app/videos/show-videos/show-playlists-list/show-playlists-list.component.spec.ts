import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPlaylistsListComponent } from './show-playlists-list.component';

describe('ShowPlaylistsListComponent', () => {
  let component: ShowPlaylistsListComponent;
  let fixture: ComponentFixture<ShowPlaylistsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPlaylistsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPlaylistsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
