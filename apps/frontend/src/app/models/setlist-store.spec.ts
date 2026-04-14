import { TestBed } from '@angular/core/testing';

import { SetlistStore } from './setlist-store';

describe('SetlistStore', () => {
  let service: SetlistStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetlistStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
