import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgEditCropperComponent } from './img-edit-cropper.component';

describe('ImgEditCropperComponent', () => {
  let component: ImgEditCropperComponent;
  let fixture: ComponentFixture<ImgEditCropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgEditCropperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgEditCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
