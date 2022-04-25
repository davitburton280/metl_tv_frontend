import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosListHolderComponent } from './videos-list-holder.component';

describe('VideosListHolderComponent', () => {
  let component: VideosListHolderComponent;
  let fixture: ComponentFixture<VideosListHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideosListHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosListHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
