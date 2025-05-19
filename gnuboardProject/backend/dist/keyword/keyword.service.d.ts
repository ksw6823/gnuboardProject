import { Repository } from 'typeorm';
import { Keyword } from '../entities/keyword.entity';
export declare class KeywordService {
    private readonly keywordRepository;
    constructor(keywordRepository: Repository<Keyword>);
    findAll(): Promise<Keyword[]>;
    findOne(id: number): Promise<Keyword | null>;
    create(data: Partial<Keyword>): Promise<Keyword>;
    update(id: number, data: Partial<Keyword>): Promise<Keyword | null>;
    remove(id: number): Promise<void>;
}
