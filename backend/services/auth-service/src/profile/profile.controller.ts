import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@packages/shared/dist/common/guards/jwt-auth.guard';
import type { Request } from 'express';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('fashion/user-profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req: Request & { user: { id: string } }) {
    return this.profileService.getMyProfile(req.user.id);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(@Req() req: Request & { user: { id: string } }, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateMyProfile(req.user.id, dto);
  }
}
