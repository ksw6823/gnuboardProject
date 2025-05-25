import { Controller, Post, Body, UnauthorizedException, ConflictException, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.loginWithUser(req.user);
  }

  @Post('register')
  async register(@Body() data: { email: string; password: string; name: string }) {
    if (!data.email || !data.password || !data.name) {
      throw new Error('필수 입력값이 누락되었습니다.');
    }
    const user = await this.authService.register({
      username: data.email,
      password: data.password,
      name: data.name,
      email: data.email,
    });
    return this.authService.login(user.username, data.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
} 