import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVideosFormComponent } from './search-videos-form.component';

describe('SearchVideosFormComponent', () => {
  let component: SearchVideosFormComponent;
  let fixture: ComponentFixture<SearchVideosFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchVideosFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVideosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
