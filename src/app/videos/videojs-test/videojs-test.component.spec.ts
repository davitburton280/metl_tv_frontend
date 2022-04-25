import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideojsTestComponent } from './videojs-test.component';

describe('VideojsTestComponent', () => {
  let component: VideojsTestComponent;
  let fixture: ComponentFixture<VideojsTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideojsTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideojsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
