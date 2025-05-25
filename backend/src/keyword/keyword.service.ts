import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from '../entities/keyword.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class KeywordService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  findAll(): Promise<Keyword[]> {
    return this.keywordRepository.find();
  }

  findOne(id: number): Promise<Keyword | null> {
    return this.keywordRepository.findOne({ where: { id } });
  }

  create(data: Partial<Keyword>): Promise<Keyword> {
    const keyword = this.keywordRepository.create(data);
    return this.keywordRepository.save(keyword);
  }

  async update(id: number, data: Partial<Keyword>): Promise<Keyword | null> {
    await this.keywordRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.keywordRepository.delete(id);
  }
} 