import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Portfolio } from '../../entities/portfolio.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content!: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @ManyToOne(() => User, user => user.comments)
  user!: User;

  @ManyToOne(() => Portfolio, portfolio => portfolio.comments)
  portfolio!: Portfolio;

  @UpdateDateColumn()
  updatedAt: Date;
} 