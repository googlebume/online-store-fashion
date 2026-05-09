import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
// import { Roles } from '@packages/shared/common/decorators/roles-metadata.decorator';
import { Roles } from '../common/decorators/roles-metadata.decorator';

@Controller('fashion/admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles('admin')
  @Get('')
  getUsers() {
    return this.usersService.getAllUsers()
  }

  @Roles('admin')
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; password?: string; role?: string },
  ) {
    return this.usersService.updateUser(id, body);
  }

  @Roles('admin')
  @Delete('delete/:id')
  deleteUser(@Param('id') id: string){
    return this.usersService.deleteUser(id)
  }
}
