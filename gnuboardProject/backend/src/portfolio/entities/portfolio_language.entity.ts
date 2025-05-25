import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PortfolioSection } from './portfolio-section.entity';

export enum LanguageProficiency {
  Basic = 'Basic',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Fluent = 'Fluent',
  Native = 'Native',
}

@Entity()
export class PortfolioLanguage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PortfolioSection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section: PortfolioSection;

  @Column()
  language: string;

  @Column({ type: 'enum', enum: LanguageProficiency })
  proficiency: LanguageProficiency;
} 