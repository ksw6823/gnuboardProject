import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Portfolio } from './portfolio.entity';

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
} 