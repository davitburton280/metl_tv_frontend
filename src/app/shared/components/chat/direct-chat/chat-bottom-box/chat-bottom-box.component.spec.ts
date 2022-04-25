import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBottomBoxComponent } from './chat-bottom-box.component';

describe('ChatBottomBoxComponent', () => {
  let component: ChatBottomBoxComponent;
  let fixture: ComponentFixture<ChatBottomBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatBottomBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBottomBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
