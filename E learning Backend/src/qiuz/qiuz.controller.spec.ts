import { Test, TestingModule } from '@nestjs/testing';
import { QiuzController } from './qiuz.controller';
import { QiuzService } from './qiuz.service';

describe('QiuzController', () => {
  let controller: QiuzController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QiuzController],
      providers: [QiuzService],
    }).compile();

    controller = module.get<QiuzController>(QiuzController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
