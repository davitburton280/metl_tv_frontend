import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialShareDialogComponent } from './social-share-dialog.component';

describe('SocialShareDialogComponent', () => {
  let component: SocialShareDialogComponent;
  let fixture: ComponentFixture<SocialShareDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialShareDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialShareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
