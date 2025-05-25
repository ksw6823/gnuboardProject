import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity()
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
} 