import { Repository } from 'typeorm';
import { Skill } from '../entities/skill.entity';
export declare class SkillService {
    private readonly skillRepository;
    constructor(skillRepository: Repository<Skill>);
    findAll(): Promise<Skill[]>;
    findOne(id: number): Promise<Skill | null>;
    create(data: Partial<Skill>): Promise<Skill>;
    update(id: number, data: Partial<Skill>): Promise<Skill | null>;
    remove(id: number): Promise<void>;
}
