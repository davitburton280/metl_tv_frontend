import { TestBed } from '@angular/core/testing';

import { NotificationsSubjectStoreService } from './notifications-subject-store.service';

describe('NotificationsSubjectStoreService', () => {
  let service: NotificationsSubjectStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsSubjectStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
