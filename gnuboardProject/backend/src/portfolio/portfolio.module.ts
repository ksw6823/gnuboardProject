import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from '../entities/portfolio.entity';
import { PortfolioSection } from '../entities/portfolio-section.entity';
import { Skill } from '../entities/skill.entity';
import { Keyword } from '../entities/keyword.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, PortfolioSection, Skill, Keyword])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {} 