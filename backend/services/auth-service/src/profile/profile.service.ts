import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenService } from '../auth-core/token.service';
import { UserIdentityService } from '../auth-core/user-identity.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userIdentityService: UserIdentityService,
  ) {}

  async getMyProfile(userId: string) {
    const userResult = await this.userIdentityService.getUserById(userId);

    if (!userResult.success || !userResult.user) {
      throw new HttpException(
        userResult.message || 'Failed to load user profile',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return {
      success: true,
      userData: userResult.user,
    };
  }

  async updateMyProfile(userId: string, dto: UpdateProfileDto) {
    if (!dto.name && !dto.email && !dto.password) {
      throw new HttpException('No profile changes provided', HttpStatus.BAD_REQUEST);
    }

    const updateResult = await this.userIdentityService.updateUser(userId, dto);

    if (!updateResult.success || !updateResult.user) {
      throw new HttpException(
        updateResult.message || 'Failed to update profile',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.tokenService.generateToken({
      id: updateResult.user.id,
      email: updateResult.user.email,
      role: this.userIdentityService.normalizeRoles(updateResult.user.role),
    });

    return {
      success: true,
      message: 'Profile updated successfully',
      userData: updateResult.user,
      token,
    };
  }
}
