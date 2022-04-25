import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatTopComponent } from './group-chat-top.component';

describe('GroupChatTopComponent', () => {
  let component: GroupChatTopComponent;
  let fixture: ComponentFixture<GroupChatTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
