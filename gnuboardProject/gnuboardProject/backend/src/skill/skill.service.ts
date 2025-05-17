import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../entities/skill.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  findAll(): Promise<Skill[]> {
    return this.skillRepository.find();
  }

  findOne(id: number): Promise<Skill | null> {
    return this.skillRepository.findOne({ where: { id } });
  }

  create(data: Partial<Skill>): Promise<Skill> {
    const skill = this.skillRepository.create(data);
    return this.skillRepository.save(skill);
  }

  async update(id: number, data: Partial<Skill>): Promise<Skill | null> {
    await this.skillRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.skillRepository.delete(id);
  }
} 