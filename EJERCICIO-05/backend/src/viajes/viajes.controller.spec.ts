import { Test, TestingModule } from '@nestjs/testing';
import { ViajesController } from './viajes.controller';

describe('ViajesController', () => {
  let controller: ViajesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViajesController],
    }).compile();

    controller = module.get<ViajesController>(ViajesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
