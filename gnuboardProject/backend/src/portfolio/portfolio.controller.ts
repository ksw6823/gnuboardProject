import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  findAll() {
    return this.portfolioService.findAll();
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
    @Body() data: {
      title: string;
      summary: string;
      skills: number[];
      keywords: number[];
      sections: { title: string; content: string; order: number }[];
      isPrivate: boolean;
      template: string;
    },
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.portfolioService.create(req.user.id, {
      ...data,
      photo,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('photo'))
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() data: {
      title?: string;
      summary?: string;
      skills?: string;
      keywords?: string;
      sections?: string;
      isPrivate?: string;
      template?: string;
    },
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.portfolioService.update(+id, req.user.id, {
      ...data,
      skills: data.skills ? JSON.parse(data.skills) : undefined,
      keywords: data.keywords ? JSON.parse(data.keywords) : undefined,
      sections: data.sections ? JSON.parse(data.sections) : undefined,
      isPrivate: data.isPrivate ? data.isPrivate === 'true' : undefined,
      template: data.template,
      photo,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.portfolioService.remove(+id, req.user.id);
  }
} 