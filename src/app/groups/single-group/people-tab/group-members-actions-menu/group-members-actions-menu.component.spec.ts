import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersActionsMenuComponent } from './group-members-actions-menu.component';

describe('GroupMembersActionsMenuComponent', () => {
  let component: GroupMembersActionsMenuComponent;
  let fixture: ComponentFixture<GroupMembersActionsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMembersActionsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMembersActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
