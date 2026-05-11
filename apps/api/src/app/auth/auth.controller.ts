import "dotenv/config";
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    let secure = true;
    if (process.env.NODE_ENV === 'development') {
      secure = false;
    }
    const token = await this.authService.login(
      body.username,
      body.password,
    );

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: secure,
      sameSite: 'lax',
    });

    return {
      success: true,
    };
  }
}