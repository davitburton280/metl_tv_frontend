import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatReusableTableComponent } from './mat-reusable-table.component';

describe('MatReusableTableComponent', () => {
  let component: MatReusableTableComponent;
  let fixture: ComponentFixture<MatReusableTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatReusableTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatReusableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
