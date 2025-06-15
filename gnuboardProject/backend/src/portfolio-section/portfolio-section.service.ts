import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortfolioSection, SectionType } from '../portfolio/entities/portfolio_section.entity';
import { CreatePortfolioSectionDto } from './dto/create-portfolio-section.dto';
import { UpdatePortfolioSectionDto } from './dto/update-portfolio-section.dto';
import { Portfolio } from '../portfolio/entities/portfolio.entity';

@Injectable()
export class PortfolioSectionService {
  constructor(
    @InjectRepository(PortfolioSection)
    private readonly sectionRepository: Repository<PortfolioSection>,
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  findAll(): Promise<PortfolioSection[]> {
    return this.sectionRepository.find({ relations: ['portfolio'] });
  }

  findOne(id: number): Promise<PortfolioSection | null> {
    return this.sectionRepository.findOne({ where: { id }, relations: ['portfolio'] });
  }

  async create(data: CreatePortfolioSectionDto): Promise<PortfolioSection> {
    const portfolio = await this.portfolioRepository.findOneBy({ id: data.portfolioId });
    if (!portfolio) throw new Error('Portfolio not found');
    const section = this.sectionRepository.create({
      portfolio,
      portfolioId: data.portfolioId,
      type: SectionType[data.type as keyof typeof SectionType],
      content: data.content,
    } as Partial<PortfolioSection>);
    return this.sectionRepository.save(section);
  }

  async update(id: number, data: UpdatePortfolioSectionDto): Promise<PortfolioSection | null> {
    const updateData: any = { ...data };
    if (data.portfolioId) {
      const portfolio = await this.portfolioRepository.findOneBy({ id: data.portfolioId });
      if (!portfolio) throw new Error('Portfolio not found');
      updateData.portfolio = portfolio;
    }
    await this.sectionRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.sectionRepository.delete(id);
  }
} 