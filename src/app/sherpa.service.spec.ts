import { TestBed } from '@angular/core/testing';

import { SherpaService } from './sherpa.service';

describe('SherpaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SherpaService = TestBed.get(SherpaService);
    expect(service).toBeTruthy();
  });
});
