import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionRequestsTabComponent } from './connection-requests-tab.component';

describe('ConnectionRequestsTabComponent', () => {
  let component: ConnectionRequestsTabComponent;
  let fixture: ComponentFixture<ConnectionRequestsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionRequestsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionRequestsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
