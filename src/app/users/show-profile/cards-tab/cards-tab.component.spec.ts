import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsTabComponent } from './cards-tab.component';

describe('CardsTabComponent', () => {
  let component: CardsTabComponent;
  let fixture: ComponentFixture<CardsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
