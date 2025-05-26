import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioSection } from './entities/portfolio-section.entity';
import { PortfolioSkill } from './entities/portfolio_skill.entity';
import { PortfolioKeyword } from './entities/portfolio_keyword.entity';
import { PortfolioJob } from './entities/portfolio_job.entity';
import { PortfolioExperience } from './entities/portfolio_experience.entity';
import { PortfolioProject } from './entities/portfolio_project.entity';
import { PortfolioCertificate } from './entities/portfolio_certificate.entity';
import { PortfolioLanguage } from './entities/portfolio_language.entity';
import { PortfolioActivity } from './entities/portfolio_activity.entity';
import { Skill } from '../skill/entities/skill.entity';
import { Keyword } from '../keyword/entities/keyword.entity';
import { Job } from '../job/entities/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Portfolio, PortfolioSection, PortfolioSkill, PortfolioKeyword, PortfolioJob,
      PortfolioExperience, PortfolioProject, PortfolioCertificate, PortfolioLanguage, PortfolioActivity,
      Skill, Keyword, Job
    ])
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {} 