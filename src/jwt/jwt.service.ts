import { JwtService as Jwt } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {
  private jwt: Jwt;

  constructor() {
    this.jwt = new Jwt({
      secret: process.env.JWT_SECRET || 'mySuperSecretKey',
      signOptions: { expiresIn: '1h' },
    });
  }

  signToken(payload: any): string {
    return this.jwt.sign(payload);
  }

  verifyToken(token: string): any {
    try {
      return this.jwt.verify(token);
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
