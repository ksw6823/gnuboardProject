import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioSection, SectionType } from './entities/portfolio_section.entity';
import { PortfolioSkill } from './entities/portfolio_skill.entity';
import { PortfolioKeyword } from './entities/portfolio_keyword.entity';
import { PortfolioJob } from './entities/portfolio_job.entity';
import { Skill } from '../skill/entities/skill.entity';
import { Keyword } from '../keyword/entities/keyword.entity';
import { Job } from '../job/entities/job.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
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
    private dataSource: DataSource,
  ) {}

  async findAll(filters?: { categories?: string[], skills?: string[], keywords?: string[] }): Promise<any[]> {
    try {
      console.log('findAll called with filters:', filters);
      const query = this.portfolioRepository
        .createQueryBuilder('portfolio')
        .leftJoinAndSelect('portfolio.user', 'user')
        .leftJoinAndSelect('portfolio.sections', 'sections')
        .leftJoinAndSelect('sections.portfolioSkills', 'portfolioSkills')
        .leftJoinAndSelect('portfolioSkills.skill', 'skill')
        .leftJoinAndSelect('sections.portfolioKeywords', 'portfolioKeywords')
        .leftJoinAndSelect('portfolioKeywords.keyword', 'keyword')
        .leftJoinAndSelect('sections.portfolioJob', 'portfolioJob')
        .leftJoinAndSelect('portfolioJob.job', 'job')
        .where('portfolio.is_private = :is_private', { is_private: false });

      if (filters?.skills && filters.skills.length > 0) {
        query.andWhere('skill.name IN (:...skills)', { skills: filters.skills });
      }

      if (filters?.keywords && filters.keywords.length > 0) {
        query.andWhere('keyword.name IN (:...keywords)', { keywords: filters.keywords });
      }

      const portfolios = await query.getMany();
      
      const result = portfolios.map(portfolio => {
        const portfolioSkills: any[] = [];
        const portfolioKeywords: any[] = [];
        const portfolioJob: any[] = [];
        
        if (portfolio.sections && Array.isArray(portfolio.sections)) {
          portfolio.sections.forEach(section => {
            if (section.portfolioSkills && Array.isArray(section.portfolioSkills)) {
              portfolioSkills.push(...section.portfolioSkills.map(ps => ({ ...ps.skill, isConfirmed: true })));
            }
            if (section.portfolioKeywords && Array.isArray(section.portfolioKeywords)) {
              portfolioKeywords.push(...section.portfolioKeywords.map(pk => ({ ...pk.keyword, isConfirmed: true })));
            }
            if (section.portfolioJob && Array.isArray(section.portfolioJob)) {
              portfolioJob.push(...section.portfolioJob.map(pj => ({ ...pj.job, isConfirmed: true })));
            }
          });
        }

        return {
          ...portfolio,
          portfolioSkills,
          portfolioKeywords,
          portfolioJob,
        };
      });

      console.log('findAll result:', result);
      return result;
    } catch (e) {
      console.error('findAll error:', e);
      throw new InternalServerErrorException('포트폴리오 전체 조회 중 오류가 발생했습니다.');
    }
  }

  async findOne(id: number): Promise<any> {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('id가 올바르지 않습니다.');
    }
    try {
      console.log('findOne called with id:', id);
      const portfolio = await this.portfolioRepository.findOne({
        where: { id: Number(id) },
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

      if (portfolio.sections && Array.isArray(portfolio.sections)) {
        portfolio.sections.forEach(section => {
          section.portfolioSkills = section.portfolioSkills || [];
          section.portfolioKeywords = section.portfolioKeywords || [];
          section.portfolioJob = section.portfolioJob || [];
        });
      }

      console.log('findOne result:', portfolio);
      return portfolio;
    } catch (e) {
      console.error('findOne error:', e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException('포트폴리오 조회 중 오류가 발생했습니다.');
    }
  }

  async create(userId: number, data: CreatePortfolioDto): Promise<Portfolio> {
    if (!userId || isNaN(Number(userId))) {
      throw new BadRequestException('userId가 올바르지 않습니다.');
    }
    try {
      console.log('create called with userId:', userId, 'data:', data);
      const portfolio = new Portfolio();
      portfolio.title = data.title;
      portfolio.is_private = data.is_private;
      portfolio.user = { id: Number(userId) } as any;
      portfolio.intro = data.intro;
      portfolio.views = data.views ?? 0;
      portfolio.likes_count = data.likes_count ?? 0;
      const savedPortfolio = await this.portfolioRepository.save(portfolio);
      let firstSectionId: number | null = null;
      const sections = Array.isArray(data.sections) ? data.sections : [];
      for (const [idx, sectionData] of sections.entries()) {
        if (!sectionData || !sectionData.type) continue;
        const section = new PortfolioSection();
        section.portfolio = savedPortfolio;
        section.type = SectionType[sectionData.type.charAt(0).toUpperCase() + sectionData.type.slice(1) as keyof typeof SectionType];
        section.content = sectionData.content;
        const savedSection = await this.sectionRepository.save(section);
        if (idx === 0) firstSectionId = savedSection.id;
      }
      if (firstSectionId) {
        if (data.jobs && data.jobs.length > 0) {
          for (const jobId of data.jobs) {
            await this.portfolioJobRepository.save({
              section: { id: firstSectionId },
              job: { id: Number(jobId) }
            });
          }
        }
        if (data.skills && data.skills.length > 0) {
          for (const skillId of data.skills) {
            await this.portfolioSkillRepository.save({
              section: { id: firstSectionId },
              skill: { id: Number(skillId) }
            });
          }
        }
        if (data.keywords && data.keywords.length > 0) {
          for (const keywordId of data.keywords) {
            await this.portfolioKeywordRepository.save({
              section: { id: firstSectionId },
              keyword: { id: Number(keywordId) }
            });
          }
        }
      }
      console.log('create result:', savedPortfolio);
      return savedPortfolio;
    } catch (e) {
      console.error('create error:', e);
      throw new InternalServerErrorException('포트폴리오 생성 중 오류가 발생했습니다.');
    }
  }

  async update(
    id: number,
    userId: number,
    data: UpdatePortfolioDto,
  ): Promise<Portfolio> {
    if (!id || isNaN(Number(id)) || !userId || isNaN(Number(userId))) {
      throw new BadRequestException('id 또는 userId가 올바르지 않습니다.');
    }
    try {
      console.log('update called with id:', id, 'userId:', userId, 'data:', data);
      const portfolio = await this.portfolioRepository.findOne({
        where: { id: Number(id), user: { id: Number(userId) } },
        relations: ['sections'],
      });
      if (!portfolio) {
        throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
      }

      const sections = Array.isArray(data.sections) ? data.sections : [];
      
      const result = await this.dataSource.transaction(async manager => {
        // 포트폴리오 기본 정보 업데이트
        if (data.title) portfolio.title = data.title;
        if (typeof data.is_private === 'boolean') portfolio.is_private = data.is_private;
        if (typeof data.intro === 'string') portfolio.intro = data.intro;
        if (typeof data.views === 'number') portfolio.views = data.views;
        if (typeof data.likes_count === 'number') portfolio.likes_count = data.likes_count;

        // 섹션 처리
        if (sections.length > 0) {
          const sectionIds = portfolio.sections.map(s => s.id);
          console.log('기존 섹션 IDs:', sectionIds);
          
          if (sectionIds.length > 0) {
            console.log('자식 테이블 삭제 시작...');
            
            const skillDeleteResult = await manager.getRepository(PortfolioSkill).delete({ sectionId: In(sectionIds) });
            console.log('portfolio_skill 삭제 결과:', skillDeleteResult);
            
            const keywordDeleteResult = await manager.getRepository(PortfolioKeyword).delete({ sectionId: In(sectionIds) });
            console.log('portfolio_keyword 삭제 결과:', keywordDeleteResult);
            
            const jobDeleteResult = await manager.getRepository(PortfolioJob).delete({ sectionId: In(sectionIds) });
            console.log('portfolio_job 삭제 결과:', jobDeleteResult);
            
            console.log('portfolio_section 삭제 시작...');
            await manager.query(`DELETE FROM portfolio_section WHERE id IN (${sectionIds.join(',')})`);
            console.log('portfolio_section 삭제 완료');
          }
          
          // 기존 섹션 배열 초기화
          portfolio.sections = [];
          
          console.log('새로운 섹션 생성 시작...');
          const newSections: PortfolioSection[] = [];
          for (const sectionData of sections) {
            const section = new PortfolioSection();
            section.portfolio = portfolio;
            section.portfolioId = portfolio.id;
            section.type = SectionType[sectionData.type.charAt(0).toUpperCase() + sectionData.type.slice(1) as keyof typeof SectionType];
            section.content = sectionData.content;
            const savedSection = await manager.getRepository(PortfolioSection).save(section);
            newSections.push(savedSection);
            console.log('섹션 저장 완료:', savedSection.id, savedSection.type);
          }
          
          // 새로 생성된 섹션들을 portfolio에 할당
          portfolio.sections = newSections;
          console.log('모든 섹션 생성 완료');
          
          // 첫 번째 섹션에 스킬/키워드/직업 정보 저장
          const firstSectionId = newSections.length > 0 ? newSections[0].id : null;
          if (firstSectionId) {
            console.log('스킬/키워드/직업 정보 저장 시작...');
            if (data.jobs && data.jobs.length > 0) {
              for (const jobId of data.jobs) {
                await manager.getRepository(PortfolioJob).save({
                  section: { id: firstSectionId },
                  job: { id: Number(jobId) }
                });
              }
              console.log('jobs 저장 완료:', data.jobs);
            }
            if (data.skills && data.skills.length > 0) {
              for (const skillId of data.skills) {
                await manager.getRepository(PortfolioSkill).save({
                  section: { id: firstSectionId },
                  skill: { id: Number(skillId) }
                });
              }
              console.log('skills 저장 완료:', data.skills);
            }
            if (data.keywords && data.keywords.length > 0) {
              for (const keywordId of data.keywords) {
                await manager.getRepository(PortfolioKeyword).save({
                  section: { id: firstSectionId },
                  keyword: { id: Number(keywordId) }
                });
              }
              console.log('keywords 저장 완료:', data.keywords);
            }
            console.log('스킬/키워드/직업 정보 저장 완료');
          }
        }

        // 트랜잭션 안에서 포트폴리오 저장
        const savedPortfolio = await manager.getRepository(Portfolio).save(portfolio);
        console.log('portfolio 저장 완료:', savedPortfolio.id);
        
        // 순환 참조 제거를 위해 새로운 객체 반환
        const result = {
          ...savedPortfolio,
          sections: savedPortfolio.sections?.map(section => ({
            id: section.id,
            portfolioId: section.portfolioId,
            type: section.type,
            content: section.content,
            portfolioSkills: section.portfolioSkills,
            portfolioKeywords: section.portfolioKeywords,
            portfolioJob: section.portfolioJob,
          })) || []
        };
        
        return result as Portfolio;
      });

      console.log('update result:', result);
      return result;
    } catch (e) {
      console.error('update error:', e);
      throw new InternalServerErrorException('포트폴리오 수정 중 오류가 발생했습니다.');
    }
  }

  async remove(id: number, userId: number): Promise<void> {
    if (!id || isNaN(Number(id)) || !userId || isNaN(Number(userId))) {
      throw new BadRequestException('id 또는 userId가 올바르지 않습니다.');
    }
    try {
      console.log('remove called with id:', id, 'userId:', userId);
      
      // 포트폴리오 존재 여부 및 권한 확인
      const portfolio = await this.portfolioRepository.findOne({
        where: { id: Number(id), user: { id: Number(userId) } },
        relations: ['sections'],
      });
      if (!portfolio) {
        throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
      }

      await this.dataSource.transaction(async manager => {
        console.log('포트폴리오 삭제 트랜잭션 시작...');
        
        // 1. 좋아요 데이터 삭제
        console.log('좋아요 데이터 삭제 중...');
        const likeDeleteResult = await manager.getRepository(Like).delete({ portfolioId: Number(id) });
        console.log('좋아요 삭제 결과:', likeDeleteResult);

        // 2. 댓글 데이터 삭제  
        console.log('댓글 데이터 삭제 중...');
        const commentDeleteResult = await manager.getRepository(Comment).delete({ portfolioId: Number(id) });
        console.log('댓글 삭제 결과:', commentDeleteResult);

        // 3. 섹션 관련 데이터 삭제
        if (portfolio.sections && portfolio.sections.length > 0) {
          const sectionIds = portfolio.sections.map(s => s.id);
          console.log('섹션 관련 데이터 삭제 중... 섹션 IDs:', sectionIds);
          
          // 포트폴리오 스킬/키워드/직업 삭제
          const skillDeleteResult = await manager.getRepository(PortfolioSkill).delete({ sectionId: In(sectionIds) });
          console.log('포트폴리오 스킬 삭제 결과:', skillDeleteResult);
          
          const keywordDeleteResult = await manager.getRepository(PortfolioKeyword).delete({ sectionId: In(sectionIds) });
          console.log('포트폴리오 키워드 삭제 결과:', keywordDeleteResult);
          
          const jobDeleteResult = await manager.getRepository(PortfolioJob).delete({ sectionId: In(sectionIds) });
          console.log('포트폴리오 직업 삭제 결과:', jobDeleteResult);
          
          // 섹션 삭제
          const sectionDeleteResult = await manager.getRepository(PortfolioSection).delete({ portfolioId: Number(id) });
          console.log('섹션 삭제 결과:', sectionDeleteResult);
        }

        // 4. 마지막으로 포트폴리오 삭제
        console.log('포트폴리오 삭제 중...');
        const portfolioDeleteResult = await manager.getRepository(Portfolio).delete({ id: Number(id) });
        console.log('포트폴리오 삭제 결과:', portfolioDeleteResult);
        
        console.log('포트폴리오 삭제 트랜잭션 완료');
      });
      
      console.log('remove completed');
    } catch (e) {
      console.error('remove error:', e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException('포트폴리오 삭제 중 오류가 발생했습니다.');
    }
  }

  async findByUserId(userId: number): Promise<Portfolio[]> {
    if (!userId || isNaN(Number(userId))) {
      throw new BadRequestException('userId가 올바르지 않습니다.');
    }
    try {
      console.log('findByUserId called with userId:', userId);
      
      const query = this.portfolioRepository
        .createQueryBuilder('portfolio')
        .leftJoinAndSelect('portfolio.user', 'user')
        .leftJoinAndSelect('portfolio.sections', 'sections')
        .leftJoinAndSelect('sections.portfolioSkills', 'portfolioSkills')
        .leftJoinAndSelect('portfolioSkills.skill', 'skill')
        .leftJoinAndSelect('sections.portfolioKeywords', 'portfolioKeywords')
        .leftJoinAndSelect('portfolioKeywords.keyword', 'keyword')
        .leftJoinAndSelect('sections.portfolioJob', 'portfolioJob')
        .leftJoinAndSelect('portfolioJob.job', 'job')
        .where('portfolio.userId = :userId', { userId: Number(userId) });

      const portfolios = await query.getMany();
      
      const result = portfolios.map(portfolio => {
        const portfolioSkills: any[] = [];
        const portfolioKeywords: any[] = [];
        const portfolioJob: any[] = [];
        
        if (portfolio.sections && Array.isArray(portfolio.sections)) {
          portfolio.sections.forEach(section => {
            if (section.portfolioSkills && Array.isArray(section.portfolioSkills)) {
              portfolioSkills.push(...section.portfolioSkills.map(ps => ({ ...ps.skill, isConfirmed: true })));
            }
            if (section.portfolioKeywords && Array.isArray(section.portfolioKeywords)) {
              portfolioKeywords.push(...section.portfolioKeywords.map(pk => ({ ...pk.keyword, isConfirmed: true })));
            }
            if (section.portfolioJob && Array.isArray(section.portfolioJob)) {
              portfolioJob.push(...section.portfolioJob.map(pj => ({ ...pj.job, isConfirmed: true })));
            }
          });
        }

        return {
          ...portfolio,
          portfolioSkills,
          portfolioKeywords,
          portfolioJob,
        };
      });

      console.log('findByUserId result:', result);
      return result;
    } catch (e) {
      console.error('findByUserId error:', e);
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException('사용자 포트폴리오 조회 중 오류가 발생했습니다.');
    }
  }
} 