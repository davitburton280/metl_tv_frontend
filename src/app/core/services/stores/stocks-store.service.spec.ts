import { TestBed } from '@angular/core/testing';

import { StocksStoreService } from './stocks-store.service';

describe('StocksStoreService', () => {
  let service: StocksStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StocksStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
