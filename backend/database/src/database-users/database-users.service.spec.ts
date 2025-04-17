import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseUsersService } from './database-users.service';

describe('DatabaseUsersService', () => {
  let service: DatabaseUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseUsersService],
    }).compile();

    service = module.get<DatabaseUsersService>(DatabaseUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
