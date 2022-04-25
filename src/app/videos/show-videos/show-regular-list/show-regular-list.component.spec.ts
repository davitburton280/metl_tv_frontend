import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRegularListComponent } from './show-regular-list.component';

describe('ShowRegularListComponent', () => {
  let component: ShowRegularListComponent;
  let fixture: ComponentFixture<ShowRegularListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRegularListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRegularListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
