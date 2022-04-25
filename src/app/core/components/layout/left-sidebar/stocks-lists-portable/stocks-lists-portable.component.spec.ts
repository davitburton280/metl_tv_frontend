import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksListsPortableComponent } from './stocks-lists-portable.component';

describe('StocksListsPortableComponent', () => {
  let component: StocksListsPortableComponent;
  let fixture: ComponentFixture<StocksListsPortableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksListsPortableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksListsPortableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
