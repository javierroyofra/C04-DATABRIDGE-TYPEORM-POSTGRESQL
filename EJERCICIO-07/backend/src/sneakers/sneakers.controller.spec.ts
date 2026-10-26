import { Test, TestingModule } from '@nestjs/testing';
import { SneakersController } from './sneakers.controller';

describe('SneakersController', () => {
  let controller: SneakersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SneakersController],
    }).compile();

    controller = module.get<SneakersController>(SneakersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
