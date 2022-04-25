import { TestBed } from '@angular/core/testing';

import { DoNotLeavePageGuard } from './do-not-leave-page.guard';

describe('DoNotLeavePageGuard', () => {
  let guard: DoNotLeavePageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DoNotLeavePageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
