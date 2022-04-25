import { TestBed } from '@angular/core/testing';

import { GroupsMessagesSubjectService } from './groups-messages-subject.service';

describe('GroupsMessagesSubjectService', () => {
  let service: GroupsMessagesSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupsMessagesSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
