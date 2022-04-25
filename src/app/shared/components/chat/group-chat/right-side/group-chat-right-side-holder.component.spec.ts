import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatRightSideHolderComponent } from './group-chat-right-side-holder.component';

describe('GroupChatRightSideHolderComponent', () => {
  let component: GroupChatRightSideHolderComponent;
  let fixture: ComponentFixture<GroupChatRightSideHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatRightSideHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatRightSideHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
