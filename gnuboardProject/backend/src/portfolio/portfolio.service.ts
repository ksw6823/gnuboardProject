import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioSection, SectionType } from './entities/portfolio-section.entity';
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
    @InjectRepository(PortfolioExperience)
    private experienceRepository: Repository<PortfolioExperience>,
    @InjectRepository(PortfolioProject)
    private projectRepository: Repository<PortfolioProject>,
    @InjectRepository(PortfolioCertificate)
    private certificateRepository: Repository<PortfolioCertificate>,
    @InjectRepository(PortfolioLanguage)
    private languageRepository: Repository<PortfolioLanguage>,
    @InjectRepository(PortfolioActivity)
    private activityRepository: Repository<PortfolioActivity>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async findAll(): Promise<Portfolio[]> {
    return this.portfolioRepository.find({
      relations: [
        'user',
        'comments',
        'sections',
        'sections.portfolioSkills',
        'sections.portfolioKeywords',
        'sections.portfolioJob',
      ],
      order: { id: 'DESC' },
    });
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
    portfolio.summary = data.summary;
    portfolio.is_private = data.isPrivate;
    portfolio.user = { id: userId } as any;
    portfolio.content = data.content ?? '';

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
      section.type = sectionData.type;
      section.order = sectionData.order;
      section.title = sectionData.title;
      const savedSection = await this.sectionRepository.save(section);

      // type별 분기
      switch (sectionData.type) {
        case SectionType.Skill:
          // skills: number[]
          for (const skillId of sectionData.skills || []) {
            const skill = await this.skillRepository.findOneBy({ id: skillId });
            if (!skill) throw new NotFoundException('Skill not found');
            const portfolioSkill = new PortfolioSkill();
            portfolioSkill.section = savedSection;
            portfolioSkill.skill = skill;
            await this.portfolioSkillRepository.save(portfolioSkill);
          }
          break;
        case SectionType.Keyword:
          // keywords: number[]
          for (const keywordId of sectionData.keywords || []) {
            const keyword = await this.keywordRepository.findOneBy({ id: keywordId });
            if (!keyword) throw new NotFoundException('Keyword not found');
            const portfolioKeyword = new PortfolioKeyword();
            portfolioKeyword.section = savedSection;
            portfolioKeyword.keyword = keyword;
            await this.portfolioKeywordRepository.save(portfolioKeyword);
          }
          break;
        case SectionType.Job:
          // job: number
          if (sectionData.job) {
            const job = await this.jobRepository.findOneBy({ id: sectionData.job });
            if (!job) throw new NotFoundException('Job not found');
            const portfolioJob = new PortfolioJob();
            portfolioJob.section = savedSection;
            portfolioJob.job = job;
            await this.portfolioJobRepository.save(portfolioJob);
          }
          break;
        case SectionType.Experience:
          // company, position, start_date, end_date, description
          const experience = new PortfolioExperience();
          experience.section = savedSection;
          experience.company = String(sectionData.company ?? '');
          experience.position = String(sectionData.position ?? '');
          experience.start_date = sectionData.start_date;
          experience.end_date = sectionData.end_date;
          experience.description = String(sectionData.description ?? '');
          await this.experienceRepository.save(experience);
          break;
        case SectionType.Project:
          // title, description, tech_stack, start_date, end_date
          const project = new PortfolioProject();
          project.section = savedSection;
          project.title = String(sectionData.title ?? '');
          project.description = String(sectionData.description ?? '');
          project.tech_stack = String(sectionData.tech_stack ?? '');
          project.start_date = sectionData.start_date;
          project.end_date = sectionData.end_date;
          await this.projectRepository.save(project);
          break;
        case SectionType.Certificate:
          // name, issuer, issue_date
          const certificate = new PortfolioCertificate();
          certificate.section = savedSection;
          certificate.name = String(sectionData.name ?? '');
          certificate.issuer = String(sectionData.issuer ?? '');
          certificate.issue_date = sectionData.issue_date;
          await this.certificateRepository.save(certificate);
          break;
        case SectionType.Language:
          // language, proficiency
          const language = new PortfolioLanguage();
          language.section = savedSection;
          language.language = String(sectionData.language ?? '');
          language.proficiency = sectionData.proficiency;
          await this.languageRepository.save(language);
          break;
        case SectionType.Activity:
          // title, organization, description, start_date, end_date
          const activity = new PortfolioActivity();
          activity.section = savedSection;
          activity.title = String(sectionData.title ?? '');
          activity.organization = String(sectionData.organization ?? '');
          activity.description = String(sectionData.description ?? '');
          activity.start_date = sectionData.start_date;
          activity.end_date = sectionData.end_date;
          await this.activityRepository.save(activity);
          break;
        default:
          break;
      }
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
    if (data.summary) portfolio.summary = data.summary;
    if (typeof data.isPrivate === 'boolean') portfolio.is_private = data.isPrivate;
    if (typeof data.content === 'string') portfolio.content = data.content;

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

    // 기존 section/상세 엔티티/관계 테이블 데이터 삭제
    if (data.sections) {
      // 모든 section id 추출
      const sectionIds = portfolio.sections.map(s => s.id);
      if (sectionIds.length > 0) {
        await this.portfolioSkillRepository.delete({ section: { id: sectionIds as any } });
        await this.portfolioKeywordRepository.delete({ section: { id: sectionIds as any } });
        await this.portfolioJobRepository.delete({ section: { id: sectionIds as any } });
        await this.experienceRepository.delete({ section: { id: sectionIds as any } });
        await this.projectRepository.delete({ section: { id: sectionIds as any } });
        await this.certificateRepository.delete({ section: { id: sectionIds as any } });
        await this.languageRepository.delete({ section: { id: sectionIds as any } });
        await this.activityRepository.delete({ section: { id: sectionIds as any } });
        await this.sectionRepository.delete({ portfolio: { id } });
      }
      // 새 section/상세 엔티티/관계 테이블 생성 (create와 동일 로직)
      for (const sectionData of data.sections) {
        const section = new PortfolioSection();
        section.portfolio = portfolio;
        section.type = sectionData.type;
        section.order = sectionData.order;
        section.title = sectionData.title;
        const savedSection = await this.sectionRepository.save(section);
        switch (sectionData.type) {
          case SectionType.Skill:
            for (const skillId of sectionData.skills || []) {
              const skill = await this.skillRepository.findOneBy({ id: skillId });
              if (!skill) throw new NotFoundException('Skill not found');
              const portfolioSkill = new PortfolioSkill();
              portfolioSkill.section = savedSection;
              portfolioSkill.skill = skill;
              await this.portfolioSkillRepository.save(portfolioSkill);
            }
            break;
          case SectionType.Keyword:
            for (const keywordId of sectionData.keywords || []) {
              const keyword = await this.keywordRepository.findOneBy({ id: keywordId });
              if (!keyword) throw new NotFoundException('Keyword not found');
              const portfolioKeyword = new PortfolioKeyword();
              portfolioKeyword.section = savedSection;
              portfolioKeyword.keyword = keyword;
              await this.portfolioKeywordRepository.save(portfolioKeyword);
            }
            break;
          case SectionType.Job:
            if (sectionData.job) {
              const job = await this.jobRepository.findOneBy({ id: sectionData.job });
              if (!job) throw new NotFoundException('Job not found');
              const portfolioJob = new PortfolioJob();
              portfolioJob.section = savedSection;
              portfolioJob.job = job;
              await this.portfolioJobRepository.save(portfolioJob);
            }
            break;
          case SectionType.Experience:
            const experience = new PortfolioExperience();
            experience.section = savedSection;
            experience.company = String(sectionData.company ?? '');
            experience.position = String(sectionData.position ?? '');
            experience.start_date = sectionData.start_date;
            experience.end_date = sectionData.end_date;
            experience.description = String(sectionData.description ?? '');
            await this.experienceRepository.save(experience);
            break;
          case SectionType.Project:
            const project = new PortfolioProject();
            project.section = savedSection;
            project.title = String(sectionData.title ?? '');
            project.description = String(sectionData.description ?? '');
            project.tech_stack = String(sectionData.tech_stack ?? '');
            project.start_date = sectionData.start_date;
            project.end_date = sectionData.end_date;
            await this.projectRepository.save(project);
            break;
          case SectionType.Certificate:
            const certificate = new PortfolioCertificate();
            certificate.section = savedSection;
            certificate.name = String(sectionData.name ?? '');
            certificate.issuer = String(sectionData.issuer ?? '');
            certificate.issue_date = sectionData.issue_date;
            await this.certificateRepository.save(certificate);
            break;
          case SectionType.Language:
            const language = new PortfolioLanguage();
            language.section = savedSection;
            language.language = String(sectionData.language ?? '');
            language.proficiency = sectionData.proficiency;
            await this.languageRepository.save(language);
            break;
          case SectionType.Activity:
            const activity = new PortfolioActivity();
            activity.section = savedSection;
            activity.title = String(sectionData.title ?? '');
            activity.organization = String(sectionData.organization ?? '');
            activity.description = String(sectionData.description ?? '');
            activity.start_date = sectionData.start_date;
            activity.end_date = sectionData.end_date;
            await this.activityRepository.save(activity);
            break;
          default:
            break;
        }
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