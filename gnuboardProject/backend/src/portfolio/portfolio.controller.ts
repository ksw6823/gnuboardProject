import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { FindPortfolioDto } from './dto/find-portfolio.dto';

@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyPortfolios(@Request() req) {
    try {
      console.log('getMyPortfolios req.user:', req.user);
      const userId = req.user?.id ?? req.user?.sub ?? req.user?.userId;
      console.log('userId:', userId, 'typeof:', typeof userId);
      if (userId === undefined || userId === null || isNaN(Number(userId))) {
        console.error('userId가 올바르지 않습니다. req.user:', req.user);
        throw new UnauthorizedException('userId가 올바르지 않습니다.');
      }
      return this.portfolioService.findByUserId(Number(userId));
    } catch (err) {
      console.error('getMyPortfolios error:', err);
      throw err;
    }
  }

  @Get()
  findAll(@Query() findPortfolioDto: FindPortfolioDto) {
    return this.portfolioService.findAll({
      categories: findPortfolioDto.categories,
      skills: findPortfolioDto.skills,
      keywords: findPortfolioDto.keywords,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portfolioService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() data: CreatePortfolioDto,
  ) {
    console.log('PortfolioController.create req.user:', req.user);
    try {
      const parsedData = {
        ...(data || {}),
        sections:
          !data || data.sections === undefined || data.sections === null
            ? []
            : typeof data.sections === 'string'
              ? (() => { try { return JSON.parse(data.sections || '[]'); } catch (e) { return []; } })()
              : data.sections,
        is_private: data && typeof data.is_private === 'string' ? data.is_private === 'true' : data?.is_private,
      };
      return this.portfolioService.create(req.user.id, parsedData);
    } catch (error) {
      throw new BadRequestException('데이터 파싱 중 오류가 발생했습니다: ' + error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() data: UpdatePortfolioDto,
  ) {
    console.log('PortfolioController.update req.user:', req.user);
    return this.portfolioService.update(+id, req.user.id, {
      ...data,
      sections:
        data.sections === undefined || data.sections === null
          ? []
          : typeof data.sections === 'string'
            ? JSON.parse(data.sections || '[]')
            : data.sections,
      is_private: typeof data.is_private === 'string' ? data.is_private === 'true' : data.is_private,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    console.log('PortfolioController.remove req.user:', req.user);
    return this.portfolioService.remove(+id, req.user.id);
  }
} 