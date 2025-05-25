import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Portfolio } from '../../entities/portfolio.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @ManyToOne(() => User, user => user.likes)
  user!: User;

  @ManyToOne(() => Portfolio, portfolio => portfolio.likes)
  portfolio!: Portfolio;
} 