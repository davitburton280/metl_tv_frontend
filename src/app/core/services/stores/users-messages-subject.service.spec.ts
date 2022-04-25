import { TestBed } from '@angular/core/testing';

import { UsersMessagesSubjectService } from './users-messages-subject.service';

describe('UsersMessagesSubjectService', () => {
  let service: UsersMessagesSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersMessagesSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
