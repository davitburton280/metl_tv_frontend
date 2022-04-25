import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletContentTabComponent } from './wallet-content-tab.component';

describe('WalletContentTabComponent', () => {
  let component: WalletContentTabComponent;
  let fixture: ComponentFixture<WalletContentTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletContentTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletContentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
