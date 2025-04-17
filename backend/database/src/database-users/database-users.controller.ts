import { Controller } from '@nestjs/common';
import { DatabaseUsersService } from './database-users.service';

@Controller('database-users')
export class DatabaseUsersController {
  constructor(private readonly databaseUsersService: DatabaseUsersService) {}
}
