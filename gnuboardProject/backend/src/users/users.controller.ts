import { Controller, Get, Put, Body, UseGuards, Request, Delete, Param, ForbiddenException, UseInterceptors, UploadedFile, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMyProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.id, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteAccount(@Request() req) {
    return this.usersService.remove(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @UseInterceptors(FileInterceptor('profileImg', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, `${basename}-${Date.now()}${ext}`);
      },
    }),
  }))
  async updateProfile(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDto: {
      name?: string;
      email?: string;
      gender?: 'Male' | 'Female';
      phone?: string;
      profileImage?: string;
      currentPassword?: string;
      newPassword?: string;
    } = {},
  ) {
    console.log('file:', file);
    console.log('updateProfileDto:', updateProfileDto);
    if (file) {
      updateProfileDto.profileImage = `uploads/${file.filename}`;
    }
    return this.usersService.updateProfile(req.user.id, updateProfileDto || {});
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Request() req,
    @Body() query: { page?: number; limit?: number },
  ) {
    if (!req.user.isAdmin) {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }
    return this.usersService.findAll(query.page, query.limit);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/role')
  async updateUserRole(
    @Param('id') id: number,
    @Body() data: { isAdmin: boolean },
    @Request() req,
  ) {
    return this.usersService.updateUserRole(id, data.isAdmin, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id') id: number,
    @Request() req,
  ) {
    return this.usersService.deleteUser(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }
} 