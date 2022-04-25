import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatMembersComponent } from './group-chat-members.component';

describe('GroupChatMembersComponent', () => {
  let component: GroupChatMembersComponent;
  let fixture: ComponentFixture<GroupChatMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
