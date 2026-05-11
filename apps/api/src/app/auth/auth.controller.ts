import "dotenv/config";
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service'
import { JwtAuthGuard } from "./jwt-auth.guard";
import { UserService } from "../users/user.service";
import { CurrentUserDto } from "../users/current-user.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // Check, whether user is loggen id
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getStatus(@Req() req: any): Promise<CurrentUserDto> {
    const user = await this.userService.findByUsername(
      req.user.username,
    );

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      categoryPref: user.categoryPref,
      memberPref: user.memberPref,
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

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('access_token');
    return { success: true };
  }
}