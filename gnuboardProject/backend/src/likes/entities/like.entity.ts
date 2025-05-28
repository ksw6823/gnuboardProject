import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';

@Entity()
export class Like {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  portfolioId: number;

  @ManyToOne(() => User, user => user.likes)
  user!: User;

  @ManyToOne(() => Portfolio, portfolio => portfolio.likes)
  portfolio!: Portfolio;

  @Column({ default: true })
  is_liked: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;
} 