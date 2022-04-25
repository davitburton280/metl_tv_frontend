import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksListsTabsComponent } from './stocks-lists-tabs.component';

describe('StocksListsTabsComponent', () => {
  let component: StocksListsTabsComponent;
  let fixture: ComponentFixture<StocksListsTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksListsTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksListsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
