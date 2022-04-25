import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersInvitationDialogComponent } from './group-members-invitation-dialog.component';

describe('GroupMembersInvitationDialogComponent', () => {
  let component: GroupMembersInvitationDialogComponent;
  let fixture: ComponentFixture<GroupMembersInvitationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMembersInvitationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMembersInvitationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
