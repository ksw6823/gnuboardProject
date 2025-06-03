import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../likes/entities/like.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ type: 'date' })
  birth!: Date;

  @Column({ type: 'enum', enum: ['Male', 'Female'] })
  gender!: 'Male' | 'Female';

  @Column()
  phone!: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ default: false })
  isAdmin!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;

  @OneToMany(() => Portfolio, portfolio => portfolio.user)
  portfolios!: Portfolio[];

  @OneToMany(() => Comment, comment => comment.user)
  comments!: Comment[];

  @OneToMany(() => Like, like => like.user)
  likes!: Like[];
} 