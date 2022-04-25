import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelProfileComponent } from './channel-profile.component';

describe('ChannelProfileComponent', () => {
  let component: ChannelProfileComponent;
  let fixture: ComponentFixture<ChannelProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
