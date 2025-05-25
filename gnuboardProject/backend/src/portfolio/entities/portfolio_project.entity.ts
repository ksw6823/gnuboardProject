import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PortfolioSection } from './portfolio-section.entity';

@Entity()
export class PortfolioProject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PortfolioSection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section: PortfolioSection;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  tech_stack: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;
} 