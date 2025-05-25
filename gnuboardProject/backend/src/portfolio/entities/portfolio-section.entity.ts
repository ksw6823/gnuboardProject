import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, OneToMany } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { PortfolioSkill } from './portfolio_skill.entity';
import { PortfolioKeyword } from './portfolio_keyword.entity';
import { PortfolioJob } from './portfolio_job.entity';

export enum SectionType {
  Keyword = 'keyword',
  Skill = 'skill',
  Experience = 'experience',
  Project = 'project',
  Certificate = 'certificate',
  Language = 'language',
  Activity = 'activity',
  Job = 'job',
}

@Entity()
@Unique(['portfolio', 'order'])
export class PortfolioSection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Portfolio, portfolio => portfolio.sections, { onDelete: 'CASCADE' })
  portfolio: Portfolio;

  @Column({ type: 'enum', enum: SectionType })
  type: SectionType;

  @Column()
  order: number;

  @Column()
  title: string;

  @OneToMany(() => PortfolioSkill, (portfolioSkill) => portfolioSkill.section)
  portfolioSkills: PortfolioSkill[];

  @OneToMany(() => PortfolioKeyword, (portfolioKeyword) => portfolioKeyword.section)
  portfolioKeywords: PortfolioKeyword[];

  @OneToMany(() => PortfolioJob, (portfolioJob) => portfolioJob.section)
  portfolioJob: PortfolioJob[];
} 