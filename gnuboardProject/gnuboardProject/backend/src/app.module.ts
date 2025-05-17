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
import { Portfolio } from './entities/portfolio.entity';
import { Comment } from './comments/entities/comment.entity';
import { Like } from './likes/entities/like.entity';
import { Skill } from './entities/skill.entity';
import { Keyword as KeywordEntity } from './entities/keyword.entity';
import { PortfolioSection } from './entities/portfolio-section.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Portfolio, Comment, Like, Skill, KeywordEntity, PortfolioSection],
        synchronize: configService.get('NODE_ENV') === 'development',
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
  ],
})
export class AppModule {}
