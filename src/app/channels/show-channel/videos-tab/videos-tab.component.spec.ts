import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosTabComponent } from './videos-tab.component';

describe('VideosTabComponent', () => {
  let component: VideosTabComponent;
  let fixture: ComponentFixture<VideosTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideosTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
