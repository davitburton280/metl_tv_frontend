import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatMessagesComponent } from './group-chat-messages.component';

describe('GroupChatMessagesComponent', () => {
  let component: GroupChatMessagesComponent;
  let fixture: ComponentFixture<GroupChatMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
