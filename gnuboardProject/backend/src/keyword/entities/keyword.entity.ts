import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
} 