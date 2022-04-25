import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTilesComponent } from './stock-tiles.component';

describe('StocksTilesComponent', () => {
  let component: StockTilesComponent;
  let fixture: ComponentFixture<StockTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
