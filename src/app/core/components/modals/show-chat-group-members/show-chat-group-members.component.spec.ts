import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChatGroupMembersComponent } from './show-chat-group-members.component';

describe('ShowChatGroupMembersComponent', () => {
  let component: ShowChatGroupMembersComponent;
  let fixture: ComponentFixture<ShowChatGroupMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowChatGroupMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowChatGroupMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
