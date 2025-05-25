import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../likes/entities/like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ nullable: false })
  email!: string;

  @Column({ type: 'date', nullable: true })
  birth?: Date;

  @Column({ type: 'enum', enum: ['Male', 'Female'], nullable: false })
  gender!: 'Male' | 'Female';

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ default: false })
  isAdmin!: boolean;

  @Column({ nullable: false })
  phone!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Portfolio, portfolio => portfolio.user)
  portfolios!: Portfolio[];

  @OneToMany(() => Comment, comment => comment.user)
  comments!: Comment[];

  @OneToMany(() => Like, like => like.user)
  likes!: Like[];
} 