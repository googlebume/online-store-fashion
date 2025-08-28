import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '@packages/shared/dist/common/decorators/roles-metadata.decorator';


@Controller('fashion/admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles('admin')
  @Get('users')
  getUsers() {
    return this.usersService.getAllUsers()
  }
}
