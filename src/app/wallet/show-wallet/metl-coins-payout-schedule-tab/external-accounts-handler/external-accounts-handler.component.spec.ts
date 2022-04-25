import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAccountsHandlerComponent } from './external-accounts-handler.component';

describe('ExternalAccountsHandlerComponent', () => {
  let component: ExternalAccountsHandlerComponent;
  let fixture: ComponentFixture<ExternalAccountsHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAccountsHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAccountsHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
