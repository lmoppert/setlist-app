import * as argon2 from 'argon2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async createToken(userId: string, username: string) {
    return this.jwtService.signAsync({
      sub: userId,
      username,
    });
  }

  async hashPassword(password: string) {
    return argon2.hash(password, {
      type: argon2.argon2id,
    });
  }

  async verifyPassword(hash: string, password: string) {
    return argon2.verify(hash, password);
  }

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) { throw new UnauthorizedException(); }

    const valid = await this.verifyPassword(user.passwordHash, password);

    if (!valid) { throw new UnauthorizedException(); }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });
    return token;
  }
}