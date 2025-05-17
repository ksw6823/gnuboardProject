import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { Keyword } from '../entities/keyword.entity';
import { User } from '../users/entities/user.entity';

@Controller('keywords')
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Get()
  findAll(): Promise<Keyword[]> {
    return this.keywordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Keyword | null> {
    return this.keywordService.findOne(Number(id));
  }

  @Post()
  create(@Body() data: Partial<Keyword>): Promise<Keyword> {
    return this.keywordService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Keyword>): Promise<Keyword | null> {
    return this.keywordService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.keywordService.remove(Number(id));
  }
} 