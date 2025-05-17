import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async toggleLike(portfolioId: number, userId: number): Promise<{ liked: boolean }> {
    const existingLike = await this.likesRepository.findOne({
      where: {
        portfolio: { id: portfolioId },
        user: { id: userId },
      },
    });

    if (existingLike) {
      await this.likesRepository.remove(existingLike);
      return { liked: false };
    }

    const like = this.likesRepository.create({
      portfolio: { id: portfolioId },
      user: { id: userId },
    });
    await this.likesRepository.save(like);
    return { liked: true };
  }

  async getLikeCount(portfolioId: number): Promise<number> {
    return this.likesRepository.count({
      where: { portfolio: { id: portfolioId } },
    });
  }

  async hasLiked(portfolioId: number, userId: number): Promise<boolean> {
    const like = await this.likesRepository.findOne({
      where: {
        portfolio: { id: portfolioId },
        user: { id: userId },
      },
    });
    return !!like;
  }
} 