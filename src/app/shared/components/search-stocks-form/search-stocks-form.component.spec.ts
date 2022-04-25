import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStocksFormComponent } from './search-stocks-form.component';

describe('SearchStocksFormComponent', () => {
  let component: SearchStocksFormComponent;
  let fixture: ComponentFixture<SearchStocksFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchStocksFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchStocksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
