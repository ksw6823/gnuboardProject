import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Portfolio } from '../entities/portfolio.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.adminService.getAllUsers();
  }

  @Get('portfolios')
  async getAllPortfolios(): Promise<Portfolio[]> {
    return this.adminService.getAllPortfolios();
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.adminService.deleteUser(id);
  }

  @Delete('portfolios/:id')
  async deletePortfolio(@Param('id') id: number): Promise<void> {
    return this.adminService.deletePortfolio(id);
  }
} 