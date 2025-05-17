import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Portfolio } from '../entities/portfolio.entity';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Portfolio)
    private portfoliosRepository: Repository<Portfolio>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'username', 'name', 'email', 'isAdmin'],
    });
  }

  async toggleAdmin(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.isAdmin = !user.isAdmin;
    return this.usersRepository.save(user);
  }

  async getAllPortfolios(): Promise<Portfolio[]> {
    return this.portfoliosRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async deletePortfolio(id: number): Promise<void> {
    const portfolio = await this.portfoliosRepository.findOne({ where: { id } });
    if (!portfolio) {
      throw new NotFoundException('포트폴리오를 찾을 수 없습니다.');
    }
    await this.portfoliosRepository.remove(portfolio);
  }

  async getAllComments(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['user', 'portfolio'],
      order: { created_at: 'DESC' },
    });
  }

  async deleteComment(id: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    await this.commentsRepository.remove(comment);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    await this.usersRepository.remove(user);
  }
} 