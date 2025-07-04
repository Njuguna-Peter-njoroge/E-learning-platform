import { Test, TestingModule } from '@nestjs/testing';
import { QiuzService } from './qiuz.service';

describe('QiuzService', () => {
  let service: QiuzService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QiuzService],
    }).compile();

    service = module.get<QiuzService>(QiuzService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
