import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistTabComponent } from './watchlist-tab.component';

describe('WatchlistTabComponent', () => {
  let component: WatchlistTabComponent;
  let fixture: ComponentFixture<WatchlistTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchlistTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchlistTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
