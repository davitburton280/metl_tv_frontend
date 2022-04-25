import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatActionsComponent } from './group-chat-actions.component';

describe('GroupChatActionsComponent', () => {
  let component: GroupChatActionsComponent;
  let fixture: ComponentFixture<GroupChatActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
