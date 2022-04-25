import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChannelComponent } from './show-channel.component';

describe('ShowChannelComponent', () => {
  let component: ShowChannelComponent;
  let fixture: ComponentFixture<ShowChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
