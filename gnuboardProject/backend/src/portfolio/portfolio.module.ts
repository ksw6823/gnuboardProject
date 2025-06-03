import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioSection } from './entities/portfolio_section.entity';
import { PortfolioSkill } from './entities/portfolio_skill.entity';
import { PortfolioKeyword } from './entities/portfolio_keyword.entity';
import { PortfolioJob } from './entities/portfolio_job.entity';
import { Skill } from '../skill/entities/skill.entity';
import { Keyword } from '../keyword/entities/keyword.entity';
import { Job } from '../job/entities/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Portfolio, PortfolioSection, PortfolioSkill, PortfolioKeyword, PortfolioJob,
      Skill, Keyword, Job
    ])
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {} 