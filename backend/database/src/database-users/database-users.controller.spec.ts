import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseUsersController } from './database-users.controller';
import { DatabaseUsersService } from './database-users.service';

describe('DatabaseUsersController', () => {
  let controller: DatabaseUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatabaseUsersController],
      providers: [DatabaseUsersService],
    }).compile();

    controller = module.get<DatabaseUsersController>(DatabaseUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
