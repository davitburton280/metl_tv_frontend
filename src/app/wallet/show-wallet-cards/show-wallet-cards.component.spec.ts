import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowWalletCardsComponent } from './show-wallet-cards.component';

describe('ShowWalletCardsComponent', () => {
  let component: ShowWalletCardsComponent;
  let fixture: ComponentFixture<ShowWalletCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowWalletCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowWalletCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
