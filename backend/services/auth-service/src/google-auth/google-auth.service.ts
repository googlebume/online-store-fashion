import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { env } from 'process';
import { randomBytes } from 'crypto';
import { GoogleCredentialDTO } from '../dto/google-credential.dto';
import { OAuth2Client } from 'google-auth-library';
import { TokenService } from '../auth-core/token.service';
import { UserIdentityService } from '../auth-core/user-identity.service';
import { isUserNotFoundMessage } from '../auth-core/user-not-found.util';

type GoogleTokenPayload = {
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
};

@Injectable()
export class GoogleAuthService {
  private readonly googleClient = new OAuth2Client(env.CLIENT_ID);

  constructor(
    private readonly tokenService: TokenService,
    private readonly userIdentityService: UserIdentityService,
  ) {}

  getClientId() {
    return {
      clientId: env.CLIENT_ID,
    };
  }

  async authWithGoogle(credentialResponse: GoogleCredentialDTO) {
    this.assertGoogleConfig();
    const payload = await this.validateGoogleCredential(credentialResponse);
    const email = payload.email?.trim().toLowerCase();

    if (!email) {
      throw new BadRequestException('Google credential does not contain email');
    }

    const existingUserResult = await this.userIdentityService.getUserByEmail(email);

    if (
      !existingUserResult.success &&
      existingUserResult.message &&
      !isUserNotFoundMessage(existingUserResult.message)
    ) {
      throw new HttpException(existingUserResult.message, HttpStatus.SERVICE_UNAVAILABLE);
    }

    if (existingUserResult.user) {
      const token = await this.tokenService.generateToken({
        id: existingUserResult.user.id,
        email: existingUserResult.user.email,
        role: this.userIdentityService.normalizeRoles(existingUserResult.user.role),
        name: existingUserResult.user.name != null && String(existingUserResult.user.name).trim()
          ? String(existingUserResult.user.name)
          : undefined,
      });

      return {
        success: true,
        isNewUser: false,
        user: existingUserResult.user,
        token,
      };
    }

    const createResult = await this.userIdentityService.createUser({
      name: this.resolveGoogleName(payload, email),
      email,
      password: randomBytes(32).toString('hex'),
    });

    if (!createResult.success || !createResult.user) {
      const isAlreadyExists =
        typeof createResult.message === 'string' &&
        createResult.message.toLowerCase().includes('already exists');

      if (isAlreadyExists) {
        const retryResult = await this.userIdentityService.getUserByEmail(email);
        if (retryResult.user) {
          const token = await this.tokenService.generateToken({
            id: retryResult.user.id,
            email: retryResult.user.email,
            role: this.userIdentityService.normalizeRoles(retryResult.user.role),
            name:
              retryResult.user.name != null && String(retryResult.user.name).trim()
                ? String(retryResult.user.name)
                : undefined,
          });
          return { success: true, isNewUser: false, user: retryResult.user, token };
        }
      }

      throw new HttpException(
        createResult.message || 'Failed to create user from Google account',
        HttpStatus.CONFLICT,
      );
    }

    const token = await this.tokenService.generateToken({
      id: createResult.user.id,
      email: createResult.user.email,
      role: this.userIdentityService.normalizeRoles(createResult.user.role),
      name:
        createResult.user.name != null && String(createResult.user.name).trim()
          ? String(createResult.user.name)
          : undefined,
    });

    return {
      success: true,
      isNewUser: true,
      user: createResult.user,
      token,
    };
  }

  private assertGoogleConfig() {
    if (!env.CLIENT_ID || !env.CLIENT_SECRET) {
      throw new HttpException(
        'Google OAuth config is incomplete (CLIENT_ID/CLIENT_SECRET)',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async validateGoogleCredential(credentialResponse: GoogleCredentialDTO): Promise<GoogleTokenPayload> {
    const { credential, clientId } = credentialResponse || {};

    if (!credential) {
      throw new BadRequestException('Missing Google credential');
    }

    if (clientId && env.CLIENT_ID && clientId !== env.CLIENT_ID) {
      throw new HttpException('Invalid Google client id', HttpStatus.UNAUTHORIZED);
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: env.CLIENT_ID,
      });

      const tokenInfo = ticket.getPayload();
      if (!tokenInfo) {
        throw new HttpException('Google token payload is empty', HttpStatus.UNAUTHORIZED);
      }

      return {
        email: tokenInfo.email,
        name: tokenInfo.name,
        given_name: tokenInfo.given_name,
        family_name: tokenInfo.family_name,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Google token verification error', HttpStatus.UNAUTHORIZED);
    }
  }

  /** Повертаємо "чисте" ім'я без будь-яких штучних суфіксів/символів. */
  private resolveGoogleName(payload: GoogleTokenPayload, email: string): string {
    const display = (payload.name || payload.given_name || '').trim().replace(/\s+/g, ' ');
    const local = email.split('@')[0]?.trim() || 'user';
    return display || local;
  }
}
