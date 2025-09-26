import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
// import { Roles } from '@packages/shared/common/decorators/roles-metadata.decorator';
import { Roles } from 'src/common/decorators/roles-metadata.decorator';

@Controller('fashion/admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles('admin')
  @Get('')
  getUsers() {
    return this.usersService.getAllUsers()
  }

  @Roles('admin')
  @Delete('delete/:id')
  deleteUser(@Param('id') id: string){
    return this.usersService.deleteUser(id)
  }
}
