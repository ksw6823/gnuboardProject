import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioSection } from '../entities/portfolio-section.entity';
import { PortfolioSectionService } from './portfolio-section.service';
import { PortfolioSectionController } from './portfolio-section.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioSection])],
  providers: [PortfolioSectionService],
  controllers: [PortfolioSectionController],
  exports: [PortfolioSectionService],
})
export class PortfolioSectionModule {} 