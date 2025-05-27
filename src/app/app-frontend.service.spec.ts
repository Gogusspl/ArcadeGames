import { TestBed } from '@angular/core/testing';

import { AppFrontendService } from './app-frontend.service';

describe('AppFrontendService', () => {
  let service: AppFrontendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppFrontendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
