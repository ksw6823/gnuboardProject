import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from '../entities/keyword.entity';
import { KeywordService } from './keyword.service';
import { KeywordController } from './keyword.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  providers: [KeywordService],
  controllers: [KeywordController],
  exports: [KeywordService],
})
export class KeywordModule {} 