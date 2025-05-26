import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortfolioSection, SectionType } from '../portfolio/entities/portfolio-section.entity';
import { User } from '../users/entities/user.entity';
import { CreatePortfolioSectionDto } from './dto/create-portfolio-section.dto';
import { UpdatePortfolioSectionDto } from './dto/update-portfolio-section.dto';

@Injectable()
export class PortfolioSectionService {
  constructor(
    @InjectRepository(PortfolioSection)
    private readonly sectionRepository: Repository<PortfolioSection>,
  ) {}

  findAll(): Promise<PortfolioSection[]> {
    return this.sectionRepository.find({ relations: ['portfolio'] });
  }

  findOne(id: number): Promise<PortfolioSection | null> {
    return this.sectionRepository.findOne({ where: { id }, relations: ['portfolio'] });
  }

  create(data: CreatePortfolioSectionDto): Promise<PortfolioSection> {
    const section = this.sectionRepository.create({
      ...data,
      portfolio: { id: data.portfolio } as any,
      type: SectionType[data.type as keyof typeof SectionType] ?? data.type,
    });
    return this.sectionRepository.save(section);
  }

  async update(id: number, data: UpdatePortfolioSectionDto): Promise<PortfolioSection | null> {
    const updateData: any = { ...data };
    if (data.portfolio) {
      updateData.portfolio = { id: data.portfolio } as any;
    }
    if (data.type) {
      updateData.type = SectionType[data.type as keyof typeof SectionType] ?? data.type;
    }
    await this.sectionRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.sectionRepository.delete(id);
  }
} 