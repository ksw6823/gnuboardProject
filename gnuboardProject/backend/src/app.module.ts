import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { SkillModule } from './skill/skill.module';
import { KeywordModule } from './keyword/keyword.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { AdminModule } from './admin/admin.module';
import { User } from './users/entities/user.entity';
import { Portfolio } from './portfolio/entities/portfolio.entity';
import { PortfolioSection } from './portfolio/entities/portfolio_section.entity';
import { PortfolioSkill } from './portfolio/entities/portfolio_skill.entity';
import { PortfolioKeyword } from './portfolio/entities/portfolio_keyword.entity';
import { PortfolioJob } from './portfolio/entities/portfolio_job.entity';
import { Comment } from './comments/entities/comment.entity';
import { Like } from './likes/entities/like.entity';
import { Skill } from './skill/entities/skill.entity';
import { Keyword as KeywordEntity } from './keyword/entities/keyword.entity';
import { Job } from './job/entities/job.entity';
import { JobModule } from './job/job.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          User, Portfolio, PortfolioSection, PortfolioSkill, PortfolioKeyword, PortfolioJob,
          Comment, Like, Skill, KeywordEntity, Job
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PortfolioModule,
    SkillModule,
    KeywordModule,
    CommentsModule,
    LikesModule,
    AdminModule,
    JobModule,
  ],
})
export class AppModule {}
