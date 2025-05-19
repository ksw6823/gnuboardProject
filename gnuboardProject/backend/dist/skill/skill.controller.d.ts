import { SkillService } from './skill.service';
import { Skill } from '../entities/skill.entity';
export declare class SkillController {
    private readonly skillService;
    constructor(skillService: SkillService);
    findAll(): Promise<Skill[]>;
    findOne(id: string): Promise<Skill | null>;
    create(data: Partial<Skill>): Promise<Skill>;
    update(id: string, data: Partial<Skill>): Promise<Skill | null>;
    remove(id: string): Promise<void>;
}
