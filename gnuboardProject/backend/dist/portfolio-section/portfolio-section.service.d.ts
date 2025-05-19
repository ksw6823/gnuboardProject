import { Repository } from 'typeorm';
import { PortfolioSection } from '../entities/portfolio-section.entity';
export declare class PortfolioSectionService {
    private readonly sectionRepository;
    constructor(sectionRepository: Repository<PortfolioSection>);
    findAll(): Promise<PortfolioSection[]>;
    findOne(id: number): Promise<PortfolioSection | null>;
    create(data: Partial<PortfolioSection>): Promise<PortfolioSection>;
    update(id: number, data: Partial<PortfolioSection>): Promise<PortfolioSection | null>;
    remove(id: number): Promise<void>;
}
