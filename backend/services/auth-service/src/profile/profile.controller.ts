import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@packages/shared/common/guards/jwt-auth.guard';
import type { Request } from 'express';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileService } from './profile.service';
import {
  authSuccessSchema,
  profileResponseSchema,
} from '@packages/shared/common/swagger/response-schemas';

@ApiTags('Profile')
@ApiBearerAuth('bearer')
@Controller('fashion/user-profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiOkResponse({ description: 'Current profile', schema: profileResponseSchema })
  async getMyProfile(@Req() req: Request & { user: { id: string } }) {
    return this.profileService.getMyProfile(req.user.id);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current authenticated user profile' })
  @ApiOkResponse({ description: 'Updated profile and refreshed token', schema: authSuccessSchema })
  async updateMyProfile(@Req() req: Request & { user: { id: string } }, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateMyProfile(req.user.id, dto);
  }
}
