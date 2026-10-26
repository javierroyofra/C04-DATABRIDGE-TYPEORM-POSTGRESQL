import { Test, TestingModule } from '@nestjs/testing';
import { SneakersService } from './sneakers.service';

describe('SneakersService', () => {
  let service: SneakersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SneakersService],
    }).compile();

    service = module.get<SneakersService>(SneakersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
