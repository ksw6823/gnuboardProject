import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { SkillService } from './skill.service';
import { Skill } from '../entities/skill.entity';
import { User } from '../users/entities/user.entity';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  findAll(): Promise<Skill[]> {
    return this.skillService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Skill | null> {
    return this.skillService.findOne(Number(id));
  }

  @Post()
  create(@Body() data: Partial<Skill>): Promise<Skill> {
    return this.skillService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Skill>): Promise<Skill | null> {
    return this.skillService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.skillService.remove(Number(id));
  }
} 