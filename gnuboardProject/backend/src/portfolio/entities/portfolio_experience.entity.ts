import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PortfolioSection } from './portfolio-section.entity';

@Entity()
export class PortfolioExperience {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PortfolioSection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section: PortfolioSection;

  @Column()
  company: string;

  @Column()
  position: string;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column('text')
  description: string;
} 