import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '../entities/portfolio.entity';
import { PortfolioSection } from '../entities/portfolio-section.entity';
import { User } from '../users/entities/user.entity';
import { Skill } from '../entities/skill.entity';
import { Keyword } from '../entities/keyword.entity';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    @InjectRepository(PortfolioSection)
    private sectionRepository: Repository<PortfolioSection>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
  ) {}

  async findAll(): Promise<Portfolio[]> {
    return this.portfolioRepository.find({
      relations: ['user', 'skills', 'keywords', 'sections'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: ['user', 'skills', 'keywords', 'sections'],
    });
    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }
    return portfolio;
  }

  async create(
    userId: number,
    data: {
      title: string;
      summary: string;
      photo?: Express.Multer.File;
      skills: number[];
      keywords: number[];
      sections: { title: string; content: string; order: number; type: string }[];
      isPrivate: boolean;
      template: string;
    },
  ): Promise<Portfolio> {
    const portfolio = new Portfolio();
    portfolio.title = data.title;
    portfolio.summary = data.summary;
    portfolio.is_private = data.isPrivate;
    portfolio.user = { id: userId } as any;
    portfolio.template = data.template;

    // 기술스택 처리
    if (data.skills && data.skills.length > 0) {
      portfolio.skills = await this.skillRepository.findByIds(data.skills);
    }
    // 키워드 처리
    if (data.keywords && data.keywords.length > 0) {
      portfolio.keywords = await this.keywordRepository.findByIds(data.keywords);
    }

    // 섹션 처리
    if (data.sections && data.sections.length > 0) {
        const savedPortfolio = await this.portfolioRepository.save(portfolio);
        const sections = data.sections.map(sectionData => {
        const section = new PortfolioSection();
        section.title = sectionData.title;
        section.content = sectionData.content;
        section.order = sectionData.order;
        section.type = sectionData.type;
        section.portfolio = savedPortfolio;
        return section;
      });
      await this.sectionRepository.save(sections);
      portfolio.sections = sections;
    }

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

    return this.portfolioRepository.save(portfolio);
  }

  async update(
    id: number,
    userId: number,
    data: {
      title?: string;
      summary?: string;
      photo?: Express.Multer.File;
      skills?: number[];
      keywords?: number[];
      sections?: { title: string; content: string; order: number; type: string }[];
      isPrivate?: boolean;
      template?: string;
    },
  ): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['skills', 'keywords', 'sections'],
    });

    if (!portfolio) {
      throw new Error('포트폴리오를 찾을 수 없습니다.');
    }

    if (data.title) portfolio.title = data.title;
    if (data.summary) portfolio.summary = data.summary;
    if (typeof data.isPrivate === 'boolean') portfolio.is_private = data.isPrivate;
    if (data.template) portfolio.template = data.template;

    // 기술스택 업데이트
    if (data.skills) {
      portfolio.skills = await this.skillRepository.findByIds(data.skills);
    }
    // 키워드 업데이트
    if (data.keywords) {
      portfolio.keywords = await this.keywordRepository.findByIds(data.keywords);
    }

    // 섹션 업데이트
    if (data.sections) {
      // 기존 섹션 삭제
      await this.sectionRepository.delete({ portfolio: { id } });
      // 새 섹션 추가
      portfolio.sections = data.sections.map(sectionData => {
        const section = new PortfolioSection();
        section.title = sectionData.title;
        section.content = sectionData.content;
        section.order = sectionData.order;
        section.type = sectionData.type;
        section.portfolio = portfolio;
        return section;
      });
    }

    // 썸네일 업데이트
    if (data.photo) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // 기존 썸네일 삭제
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