import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistInfoFormComponent } from './playlist-info-form.component';

describe('PlaylistInfoFormComponent', () => {
  let component: PlaylistInfoFormComponent;
  let fixture: ComponentFixture<PlaylistInfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistInfoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
