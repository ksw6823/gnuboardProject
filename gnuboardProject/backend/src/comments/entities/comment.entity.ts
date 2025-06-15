import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content!: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;

  @Column()
  userId!: number;

  @Column()
  portfolioId!: number;

  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Portfolio, portfolio => portfolio.comments)
  @JoinColumn({ name: 'portfolioId' })
  portfolio!: Portfolio;
} 