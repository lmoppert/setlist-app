import "dotenv/config";
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service'
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Check, whether user is loggen id
  @UseGuards(JwtAuthGuard)
  @Get('status')
  getStatus(@Req() req: any) {
    return {
      user: req.user,
    };
  }

  // Login endpoint, no AuthGuard!
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