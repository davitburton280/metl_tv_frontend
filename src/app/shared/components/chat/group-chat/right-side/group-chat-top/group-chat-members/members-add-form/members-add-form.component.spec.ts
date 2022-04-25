import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersAddFormComponent } from './members-add-form.component';

describe('MembersAddFormComponent', () => {
  let component: MembersAddFormComponent;
  let fixture: ComponentFixture<MembersAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
