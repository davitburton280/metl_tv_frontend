import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectChatMessagesComponent } from './direct-chat-messages.component';

describe('DirectChatMessagesComponent', () => {
  let component: DirectChatMessagesComponent;
  let fixture: ComponentFixture<DirectChatMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectChatMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectChatMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
