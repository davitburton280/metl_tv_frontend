import { TestBed } from '@angular/core/testing';

import { GroupsStoreService } from './groups-store.service';

describe('GroupsStoreService', () => {
  let service: GroupsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
