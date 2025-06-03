import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PortfolioSection } from './portfolio_section.entity';
import { Skill } from '../../skill/entities/skill.entity';

@Entity()
export class PortfolioSkill {
  @PrimaryColumn()
  sectionId: number;

  @PrimaryColumn()
  skillId: number;

  @ManyToOne(() => PortfolioSection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sectionId' })
  section: PortfolioSection;

  @ManyToOne(() => Skill, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
} 