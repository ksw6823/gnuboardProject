import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PortfolioSection } from './portfolio-section.entity';
import { Job } from '../../job/entities/job.entity';

@Entity()
export class PortfolioJob {
  @PrimaryColumn()
  sectionId: number;

  @PrimaryColumn()
  jobId: number;

  @ManyToOne(() => PortfolioSection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section: PortfolioSection;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;
} 