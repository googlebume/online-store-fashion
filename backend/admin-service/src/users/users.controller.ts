import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('fashion/admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  getUsers() {
    return this.usersService.getAllUsers()
  }
}
