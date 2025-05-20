import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { User } from '../users/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class PortfolioSection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Portfolio, portfolio => portfolio.sections)
  @Exclude()
  portfolio: Portfolio;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'int', default: 0 })
  order: number;
} 