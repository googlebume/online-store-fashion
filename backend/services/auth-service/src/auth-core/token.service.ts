import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(data: { id: string; email: string; role: string[] }): Promise<string> {
    return this.jwtService.sign({
      id: data.id,
      email: data.email,
      roles: data.role,
    });
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }
}
