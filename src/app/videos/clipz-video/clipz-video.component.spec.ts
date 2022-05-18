import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipzVideoComponent } from './clipz-video.component';

describe('ClipzVideoComponent', () => {
  let component: ClipzVideoComponent;
  let fixture: ComponentFixture<ClipzVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClipzVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipzVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
