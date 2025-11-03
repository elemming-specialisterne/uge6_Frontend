import { TestBed } from '@angular/core/testing';

import { JwtIntercepter } from './jwt-intercepter';

describe('JwtIntercepter', () => {
  let service: JwtIntercepter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtIntercepter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
