import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortfolioSection } from '../entities/portfolio-section.entity';
import { User } from '../users/entities/user.entity';

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

  create(data: Partial<PortfolioSection>): Promise<PortfolioSection> {
    const section = this.sectionRepository.create(data);
    return this.sectionRepository.save(section);
  }

  async update(id: number, data: Partial<PortfolioSection>): Promise<PortfolioSection | null> {
    await this.sectionRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.sectionRepository.delete(id);
  }
} 