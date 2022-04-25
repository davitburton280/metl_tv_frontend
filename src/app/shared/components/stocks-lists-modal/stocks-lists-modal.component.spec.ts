import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksListsModalComponent } from './stocks-lists-modal.component';

describe('StocksListsComponent', () => {
  let component: StocksListsModalComponent;
  let fixture: ComponentFixture<StocksListsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksListsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksListsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
