import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksMarqueeComponent } from './stocks-marquee.component';

describe('StocksMarqueeComponent', () => {
  let component: StocksMarqueeComponent;
  let fixture: ComponentFixture<StocksMarqueeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksMarqueeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksMarqueeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
