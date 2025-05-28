import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PortfolioSection } from './portfolio-section.entity';

@Entity()
export class PortfolioCertificate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PortfolioSection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section: PortfolioSection;

  @Column()
  name: string;

  @Column()
  issuer: string;

  @Column({ type: 'date' })
  issue_date: Date;
} 