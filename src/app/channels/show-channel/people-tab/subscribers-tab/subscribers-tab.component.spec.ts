import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribersTabComponent } from './subscribers-tab.component';

describe('SubscribersTabComponent', () => {
  let component: SubscribersTabComponent;
  let fixture: ComponentFixture<SubscribersTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribersTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
