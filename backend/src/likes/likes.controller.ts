import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('portfolios/:portfolioId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  toggleLike(@Param('portfolioId') portfolioId: string, @Request() req) {
    return this.likesService.toggleLike(+portfolioId, req.user.id);
  }

  @Get('count')
  getLikeCount(@Param('portfolioId') portfolioId: string) {
    return this.likesService.getLikeCount(+portfolioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  hasLiked(@Param('portfolioId') portfolioId: string, @Request() req) {
    return this.likesService.hasLiked(+portfolioId, req.user.id);
  }
} 