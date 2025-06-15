import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PortfolioSection } from './portfolio_section.entity';
import { Keyword } from '../../keyword/entities/keyword.entity';

@Entity()
export class PortfolioKeyword {
  @PrimaryColumn()
  sectionId: number;

  @PrimaryColumn()
  keywordId: number;

  @ManyToOne(() => PortfolioSection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section: PortfolioSection;

  @ManyToOne(() => Keyword, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'keywordId' })
  keyword: Keyword;
} 