import { TestBed } from '@angular/core/testing';

import { GigStore } from './gig-store';

describe('GigStore', () => {
  let service: GigStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GigStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
