import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { PortfolioSectionService } from './portfolio-section.service';
import { PortfolioSection } from '../entities/portfolio-section.entity';
import { User } from '../users/entities/user.entity';

@Controller('portfolio-sections')
export class PortfolioSectionController {
  constructor(private readonly sectionService: PortfolioSectionService) {}

  @Get()
  findAll(): Promise<PortfolioSection[]> {
    return this.sectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PortfolioSection | null> {
    return this.sectionService.findOne(Number(id));
  }

  @Post()
  create(@Body() data: Partial<PortfolioSection>): Promise<PortfolioSection> {
    return this.sectionService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<PortfolioSection>): Promise<PortfolioSection | null> {
    return this.sectionService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.sectionService.remove(Number(id));
  }
} 