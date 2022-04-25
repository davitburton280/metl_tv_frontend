import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatLeftSideHolderComponent } from './group-chat-left-side-holder.component';

describe('GroupChatLeftSideHolderComponent', () => {
  let component: GroupChatLeftSideHolderComponent;
  let fixture: ComponentFixture<GroupChatLeftSideHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupChatLeftSideHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatLeftSideHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
