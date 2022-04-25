import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFormPlaceholderComponent } from './post-form-placeholder.component';

describe('PostFormPlaceholderComponent', () => {
  let component: PostFormPlaceholderComponent;
  let fixture: ComponentFixture<PostFormPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostFormPlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostFormPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
