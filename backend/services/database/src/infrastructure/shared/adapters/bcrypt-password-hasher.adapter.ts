import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { IPasswordHasher } from '../../../application/ports/password-hasher.port';

@Injectable()
export class BcryptPasswordHasherAdapter implements IPasswordHasher {
  private readonly saltRounds = 10;

  async hash(plain: string): Promise<string> {
    return bcryptjs.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcryptjs.compare(plain, hashed);
  }
}
