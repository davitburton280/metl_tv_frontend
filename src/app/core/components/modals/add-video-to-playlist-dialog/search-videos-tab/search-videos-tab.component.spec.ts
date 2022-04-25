import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVideosTabComponent } from './search-videos-tab.component';

describe('SearchVideosTabComponent', () => {
  let component: SearchVideosTabComponent;
  let fixture: ComponentFixture<SearchVideosTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchVideosTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVideosTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
