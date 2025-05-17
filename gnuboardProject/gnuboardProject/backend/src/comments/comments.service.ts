import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async findAllByPortfolio(portfolioId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { portfolio: { id: portfolioId } },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async create(portfolioId: number, userId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      portfolio: { id: portfolioId },
      user: { id: userId },
    });
    return this.commentsRepository.save(comment);
  }

  async findAll(portfolioId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { portfolio: { id: portfolioId } },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: number, userId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    await this.commentsRepository.remove(comment);
  }
} 