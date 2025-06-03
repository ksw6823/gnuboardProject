import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { FindPortfolioDto } from './dto/find-portfolio.dto';

@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

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
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @Request() req,
    @Body() data: CreatePortfolioDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    try {
      const parsedData = {
        ...data,
        sections: typeof data.sections === 'string' ? JSON.parse(data.sections || '[]') : data.sections,
        isPrivate: typeof data.isPrivate === 'string' ? data.isPrivate === 'true' : data.isPrivate,
        photo,
      };
      return this.portfolioService.create(req.user.id, parsedData);
    } catch (error) {
      throw new Error('데이터 파싱 중 오류가 발생했습니다: ' + error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('photo'))
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() data: UpdatePortfolioDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.portfolioService.update(+id, req.user.id, {
      ...data,
      sections: typeof data.sections === 'string' ? JSON.parse(data.sections) : data.sections,
      isPrivate: typeof data.isPrivate === 'string' ? data.isPrivate === 'true' : data.isPrivate,
      photo,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.portfolioService.remove(+id, req.user.id);
  }
} 