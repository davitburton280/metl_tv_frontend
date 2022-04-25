import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChatroomsComponent } from './show-chatrooms.component';

describe('ShowChatroomsComponent', () => {
  let component: ShowChatroomsComponent;
  let fixture: ComponentFixture<ShowChatroomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowChatroomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowChatroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
