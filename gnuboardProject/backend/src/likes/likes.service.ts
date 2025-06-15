import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Portfolio } from '../portfolio/entities/portfolio.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {}

  async toggleLike(portfolioId: number, userId: number): Promise<{ liked: boolean }> {
    const existingLike = await this.likesRepository.findOne({
      where: {
        portfolio: { id: portfolioId },
        user: { id: userId },
      },
    });

    let liked: boolean;
    
    if (existingLike) {
      await this.likesRepository.remove(existingLike);
      liked = false;
    } else {
      const like = this.likesRepository.create({
        portfolio: { id: portfolioId },
        user: { id: userId },
      });
      await this.likesRepository.save(like);
      liked = true;
    }

    // 포트폴리오의 likes_count 업데이트
    const currentLikeCount = await this.getLikeCount(portfolioId);
    await this.portfolioRepository.update(portfolioId, { likes_count: currentLikeCount });

    return { liked };
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