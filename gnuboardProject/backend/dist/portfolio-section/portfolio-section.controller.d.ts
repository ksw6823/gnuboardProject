import { PortfolioSectionService } from './portfolio-section.service';
import { PortfolioSection } from '../entities/portfolio-section.entity';
export declare class PortfolioSectionController {
    private readonly sectionService;
    constructor(sectionService: PortfolioSectionService);
    findAll(): Promise<PortfolioSection[]>;
    findOne(id: string): Promise<PortfolioSection | null>;
    create(data: Partial<PortfolioSection>): Promise<PortfolioSection>;
    update(id: string, data: Partial<PortfolioSection>): Promise<PortfolioSection | null>;
    remove(id: string): Promise<void>;
}
