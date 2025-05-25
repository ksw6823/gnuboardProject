import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PortfolioSection } from './portfolio-section.entity';
import { Skill } from './skill.entity';
import { Keyword } from './keyword.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
// Skill, Keyword, PortfolioSection 엔티티는 추후 생성

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  summary: string;

  @Column('text', { nullable: true })
  content: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: false })
  is_private: boolean;

  @Column({ type: 'varchar', default: 'default' })
  template: string;

  @ManyToOne(() => User, user => user.portfolios)
  user: User;

  @OneToMany(() => PortfolioSection, section => section.portfolio, { cascade: true })
  sections: PortfolioSection[];

  @ManyToMany(() => Skill)
  @JoinTable({ name: 'portfolio_skills' })
  skills: Skill[];

  @ManyToMany(() => Keyword)
  @JoinTable({ name: 'portfolio_keywords' })
  keywords: Keyword[];

  @OneToMany(() => Like, like => like.portfolio)
  likes: Like[];

  @OneToMany(() => Comment, comment => comment.portfolio)
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // skills, keywords, sections 등은 추후 추가
} 