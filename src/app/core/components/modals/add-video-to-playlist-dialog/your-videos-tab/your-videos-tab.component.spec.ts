import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourVideosTabComponent } from './your-videos-tab.component';

describe('YourVideosTabComponent', () => {
  let component: YourVideosTabComponent;
  let fixture: ComponentFixture<YourVideosTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourVideosTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourVideosTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
