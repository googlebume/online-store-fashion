import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
// import { RolesGuard } from '@packages/shared/src/common/guards/roles.guard';
import { Roles } from '@packages/shared/common/decorators/roles-metadata.decorator';
// import { JwtAuthGuard } from '@packages/shared/src/common/guards/jwt-auth.guard';


@Controller('fashion/admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles('admin')
  // @UseGuards(
  //   JwtAuthGuard,
  //   RolesGuard
  // )
  @Get('users')
  getUsers() {
    return this.usersService.getAllUsers()
  }
}
