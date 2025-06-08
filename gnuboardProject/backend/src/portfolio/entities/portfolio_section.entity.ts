import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { PortfolioSkill } from './portfolio_skill.entity';
import { PortfolioKeyword } from './portfolio_keyword.entity';
import { PortfolioJob } from './portfolio_job.entity';

export enum SectionType {
  Education = 'education',
  Experience = 'experience',
  Project = 'project',
  Certificate = 'certificate',
  Language = 'language',
  Activity = 'activity',
}

@Entity()
export class PortfolioSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  portfolioId: number;

  @ManyToOne(() => Portfolio, portfolio => portfolio.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'portfolioId' })
  portfolio: Portfolio;

  @Column({ type: 'enum', enum: SectionType })
  type: SectionType;

  @Column('text')
  content: string;

  @OneToMany(() => PortfolioSkill, (portfolioSkill) => portfolioSkill.section)
  portfolioSkills: PortfolioSkill[];

  @OneToMany(() => PortfolioKeyword, (portfolioKeyword) => portfolioKeyword.section)
  portfolioKeywords: PortfolioKeyword[];

  @OneToMany(() => PortfolioJob, (portfolioJob) => portfolioJob.section)
  portfolioJob: PortfolioJob[];
} 