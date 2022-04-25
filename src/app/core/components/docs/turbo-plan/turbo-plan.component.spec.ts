import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurboPlanComponent } from './turbo-plan.component';

describe('TurboPlanComponent', () => {
  let component: TurboPlanComponent;
  let fixture: ComponentFixture<TurboPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurboPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurboPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
