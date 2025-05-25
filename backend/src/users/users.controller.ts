import { Controller, Get, Put, Body, UseGuards, Request, Delete, Param, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/portfolios')
  async getMyPortfolios(@Request() req) {
    return this.usersService.findUserPortfolios(req.user.id);
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
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: {
      name?: string;
      email?: string;
      profileImage?: string;
      currentPassword?: string;
      newPassword?: string;
    },
  ) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
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