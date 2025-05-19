import { KeywordService } from './keyword.service';
import { Keyword } from '../entities/keyword.entity';
export declare class KeywordController {
    private readonly keywordService;
    constructor(keywordService: KeywordService);
    findAll(): Promise<Keyword[]>;
    findOne(id: string): Promise<Keyword | null>;
    create(data: Partial<Keyword>): Promise<Keyword>;
    update(id: string, data: Partial<Keyword>): Promise<Keyword | null>;
    remove(id: string): Promise<void>;
}
