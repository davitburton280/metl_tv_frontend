import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRequestsListComponent } from './member-requests-list.component';

describe('MemberRequestsListComponent', () => {
  let component: MemberRequestsListComponent;
  let fixture: ComponentFixture<MemberRequestsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberRequestsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
