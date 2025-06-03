import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioSection, SectionType } from './entities/portfolio_section.entity';
import { PortfolioSkill } from './entities/portfolio_skill.entity';
import { PortfolioKeyword } from './entities/portfolio_keyword.entity';
import { PortfolioJob } from './entities/portfolio_job.entity';
import { Skill } from '../skill/entities/skill.entity';
import { Keyword } from '../keyword/entities/keyword.entity';
import { Job } from '../job/entities/job.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    @InjectRepository(PortfolioSection)
    private sectionRepository: Repository<PortfolioSection>,
    @InjectRepository(PortfolioSkill)
    private portfolioSkillRepository: Repository<PortfolioSkill>,
    @InjectRepository(PortfolioKeyword)
    private portfolioKeywordRepository: Repository<PortfolioKeyword>,
    @InjectRepository(PortfolioJob)
    private portfolioJobRepository: Repository<PortfolioJob>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async findAll(filters?: {
    categories?: string[];
    skills?: string[];
    keywords?: string[];
  }): Promise<Portfolio[]> {
    const queryBuilder = this.portfolioRepository
      .createQueryBuilder('portfolio')
      .leftJoinAndSelect('portfolio.user', 'user')
      .leftJoinAndSelect('portfolio.comments', 'comments')
      .leftJoinAndSelect('portfolio.sections', 'sections')
      .leftJoinAndSelect('sections.portfolioSkills', 'portfolioSkills')
      .leftJoinAndSelect('portfolioSkills.skill', 'skill')
      .leftJoinAndSelect('sections.portfolioKeywords', 'portfolioKeywords')
      .leftJoinAndSelect('portfolioKeywords.keyword', 'keyword')
      .leftJoinAndSelect('sections.portfolioJob', 'portfolioJob')
      .leftJoinAndSelect('portfolioJob.job', 'job')
      .orderBy('portfolio.id', 'DESC');

    if (filters?.categories?.length) {
      queryBuilder.andWhere('job.name IN (:...categories)', { categories: filters.categories });
    }

    if (filters?.skills?.length) {
      queryBuilder.andWhere('skill.name IN (:...skills)', { skills: filters.skills });
    }

    if (filters?.keywords?.length) {
      queryBuilder.andWhere('keyword.name IN (:...keywords)', { keywords: filters.keywords });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: [
        'user',
        'comments',
        'sections',
        'sections.portfolioSkills',
        'sections.portfolioKeywords',
        'sections.portfolioJob',
      ],
    });
    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }
    return portfolio;
  }

  async create(
    userId: number,
    data: CreatePortfolioDto,
  ): Promise<Portfolio> {
    // 1. Portfolio 저장
    const portfolio = new Portfolio();
    portfolio.title = data.title;
    portfolio.is_private = data.is_private;
    portfolio.user = { id: userId } as any;
    portfolio.intro = data.intro;
    portfolio.views = data.views ?? 0;
    portfolio.likes_count = data.likes_count ?? 0;

    // 썸네일 처리
    if (data.photo) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filename = `${Date.now()}-${data.photo.originalname}`;
      fs.writeFileSync(path.join(uploadDir, filename), data.photo.buffer);
      portfolio.photo = filename;
    }

    const savedPortfolio = await this.portfolioRepository.save(portfolio);

    // 2. sections 반복
    for (const sectionData of data.sections) {
      const section = new PortfolioSection();
      section.portfolio = savedPortfolio;
      section.type = SectionType[sectionData.type.charAt(0).toUpperCase() + sectionData.type.slice(1) as keyof typeof SectionType];
      section.content = sectionData.content;
      await this.sectionRepository.save(section);
    }

    return savedPortfolio;
  }

  async update(
    id: number,
    userId: number,
    data: UpdatePortfolioDto,
  ): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['sections'],
    });

    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }

    if (data.title) portfolio.title = data.title;
    if (typeof data.is_private === 'boolean') portfolio.is_private = data.is_private;
    if (typeof data.intro === 'string') portfolio.intro = data.intro;
    if (typeof data.views === 'number') portfolio.views = data.views;
    if (typeof data.likes_count === 'number') portfolio.likes_count = data.likes_count;

    // 썸네일 업데이트
    if (data.photo) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      if (portfolio.photo) {
        const oldPhotoPath = path.join(uploadDir, portfolio.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      const filename = `${Date.now()}-${data.photo.originalname}`;
      fs.writeFileSync(path.join(uploadDir, filename), data.photo.buffer);
      portfolio.photo = filename;
    }

    // 기존 section 데이터 삭제 및 재생성
    if (data.sections) {
      const sectionIds = portfolio.sections.map(s => s.id);
      if (sectionIds.length > 0) {
        await this.sectionRepository.delete({ portfolio: { id } });
      }
      for (const sectionData of data.sections) {
        const section = new PortfolioSection();
        section.portfolio = portfolio;
        section.type = SectionType[sectionData.type.charAt(0).toUpperCase() + sectionData.type.slice(1) as keyof typeof SectionType];
        section.content = sectionData.content;
        await this.sectionRepository.save(section);
      }
    }
    return this.portfolioRepository.save(portfolio);
  }

  async remove(id: number, userId: number): Promise<void> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!portfolio) {
      throw new Error('포트폴리오를 찾을 수 없습니다.');
    }

    // 썸네일 삭제
    if (portfolio.photo) {
      const photoPath = path.join(process.cwd(), 'uploads', portfolio.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await this.portfolioRepository.remove(portfolio);
  }
} 