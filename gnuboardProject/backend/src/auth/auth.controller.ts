import { Controller, Post, Body, UnauthorizedException, ConflictException, UseGuards, Request, Get, Query, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @UseInterceptors(FileInterceptor('profileImg', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        // username을 Body에서 가져옴 (userId 또는 email)
        const body = req.body;
        const username = body.userId || body.email || 'profile';
        const ext = extname(file.originalname);
        cb(null, `${username}${ext}`);
      },
    }),
    // 파일 확장자 제한 (이미지 파일만 허용)
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\//)) {
        return cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
      }
      cb(null, true);
    },
  }))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: any
  ) {
    if (!data.userId) {
      throw new BadRequestException('아이디를 입력해주세요.');
    }
    if (!data.email) {
      throw new BadRequestException('이메일을 입력해주세요.');
    }
    if (!data.password) {
      throw new BadRequestException('비밀번호를 입력해주세요.');
    }
    if (!data.name) {
      throw new Error('필수 입력값이 누락되었습니다.');
    }
    // birthYear, birthMonth, birthDay를 Date로 합치기
    let birth: Date | undefined = undefined;
    if (data.birthYear && data.birthMonth && data.birthDay) {
      // JS Date는 월이 0부터 시작하므로 -1 필요
      birth = new Date(Number(data.birthYear), Number(data.birthMonth) - 1, Number(data.birthDay));
    }
    // gender 값 보정 (Male/Female만 허용)
    let gender: 'Male' | 'Female' | undefined = undefined;
    if (data.gender === 'male' || data.gender === 'Male') gender = 'Male';
    if (data.gender === 'female' || data.gender === 'Female') gender = 'Female';
    if (!gender) {
      throw new BadRequestException('성별을 선택해주세요.');
    }
    if (!data.phone) {
      throw new BadRequestException('전화번호를 입력해주세요.');
    }
    // 파일 저장 경로 생성 (예시: /uploads/filename)
    const profileImagePath = file ? `/uploads/${file.filename}` : undefined;
    const user = await this.authService.register({
      username: data.userId,
      password: data.password,
      name: data.name,
      email: data.email,
      gender,
      birth,
      phone: data.phone,
      profileImage: profileImagePath,
    });
    return this.authService.login(user.username, data.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    if (!username) {
      return { available: false, message: '아이디를 입력해주세요.' };
    }
    const user = await this.usersService.findByUsername(username);
    if (user) {
      return { available: false, message: '이미 사용 중인 아이디입니다.' };
    }
    return { available: true, message: '사용 가능한 아이디입니다.' };
  }
}