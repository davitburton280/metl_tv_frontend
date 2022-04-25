import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveBankAccountComponent } from './save-bank-account.component';

describe('SaveBankAccountComponent', () => {
  let component: SaveBankAccountComponent;
  let fixture: ComponentFixture<SaveBankAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveBankAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
