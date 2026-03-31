import { TestBed } from '@angular/core/testing';

import { Library } from './library';

describe('Library', () => {
  let service: Library;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
