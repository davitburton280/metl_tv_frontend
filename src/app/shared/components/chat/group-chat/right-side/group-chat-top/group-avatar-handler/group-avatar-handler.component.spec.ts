import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAvatarHandlerComponent } from './group-avatar-handler.component';

describe('GroupAvatarHandlerComponent', () => {
  let component: GroupAvatarHandlerComponent;
  let fixture: ComponentFixture<GroupAvatarHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAvatarHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAvatarHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
