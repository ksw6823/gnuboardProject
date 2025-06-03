import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';

export enum SectionType {
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
} 