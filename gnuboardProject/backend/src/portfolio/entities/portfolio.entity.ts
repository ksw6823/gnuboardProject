import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Like } from '../../likes/entities/like.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { PortfolioSection } from './portfolio_section.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  photo: string;

  @Column({ default: false })
  is_private: boolean;

  @Column('text')
  intro: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes_count: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.portfolios)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Like, like => like.portfolio)
  likes: Like[];

  @OneToMany(() => Comment, comment => comment.portfolio)
  comments: Comment[];

  @OneToMany(() => PortfolioSection, section => section.portfolio)
  sections: PortfolioSection[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
} 