import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
// import { Roles } from '@packages/shared/common/decorators/roles-metadata.decorator';
import { Roles } from '../common/decorators/roles-metadata.decorator';
import {
  successMessageSchema,
  userSchema,
} from '@packages/shared/common/swagger/response-schemas';

@ApiTags('Admin Users')
@ApiBearerAuth('bearer')
@Controller('fashion/admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles('admin')
  @Get('')
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'All users', schema: { type: 'array', items: userSchema } })
  getUsers() {
    return this.usersService.getAllUsers()
  }

  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiParam({ name: 'id', example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated User' },
        email: { type: 'string', example: 'updated@example.com' },
        password: { type: 'string', example: 'NewStrongPass123' },
        role: { type: 'string', example: 'admin' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Updated user result',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'User updated successfully' },
        user: userSchema,
      },
    },
  })
  updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; password?: string; role?: string },
  ) {
    return this.usersService.updateUser(id, body);
  }

  @Roles('admin')
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiParam({ name: 'id', example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001' })
  @ApiOkResponse({ description: 'Deletion result', schema: successMessageSchema })
  deleteUser(@Param('id') id: string){
    return this.usersService.deleteUser(id)
  }
}
