import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionLinksComponent } from './section-links.component';

describe('SectionLinksComponent', () => {
  let component: SectionLinksComponent;
  let fixture: ComponentFixture<SectionLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
