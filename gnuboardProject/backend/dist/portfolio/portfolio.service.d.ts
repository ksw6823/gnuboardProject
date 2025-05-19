import { Repository } from 'typeorm';
import { Portfolio } from '../entities/portfolio.entity';
import { PortfolioSection } from '../entities/portfolio-section.entity';
import { Skill } from '../entities/skill.entity';
import { Keyword } from '../entities/keyword.entity';
export declare class PortfolioService {
    private portfolioRepository;
    private sectionRepository;
    private skillRepository;
    private keywordRepository;
    constructor(portfolioRepository: Repository<Portfolio>, sectionRepository: Repository<PortfolioSection>, skillRepository: Repository<Skill>, keywordRepository: Repository<Keyword>);
    findAll(): Promise<Portfolio[]>;
    findOne(id: number): Promise<Portfolio>;
    create(userId: number, data: {
        title: string;
        summary: string;
        content: string;
        photo?: Express.Multer.File;
        skills: number[];
        keywords: number[];
        sections: {
            title: string;
            content: string;
            order: number;
        }[];
        isPrivate: boolean;
    }): Promise<Portfolio>;
    update(id: number, userId: number, data: {
        title?: string;
        summary?: string;
        content?: string;
        photo?: Express.Multer.File;
        skills?: number[];
        keywords?: number[];
        sections?: {
            title: string;
            content: string;
            order: number;
        }[];
        isPrivate?: boolean;
    }): Promise<Portfolio>;
    remove(id: number, userId: number): Promise<void>;
}
