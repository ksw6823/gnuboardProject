import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Portfolio } from '../entities/portfolio.entity';
import { Comment } from '../comments/entities/comment.entity';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Portfolio, Comment]),
    CommentsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {} 