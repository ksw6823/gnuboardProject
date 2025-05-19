import { PortfolioService } from './portfolio.service';
export declare class PortfolioController {
    private readonly portfolioService;
    constructor(portfolioService: PortfolioService);
    findAll(): Promise<import("../entities/portfolio.entity").Portfolio[]>;
    findOne(id: string): Promise<import("../entities/portfolio.entity").Portfolio>;
    create(req: any, data: {
        title: string;
        summary: string;
        content: string;
        skills: string;
        keywords: string;
        sections: string;
        isPrivate: string;
    }, photo?: Express.Multer.File): Promise<import("../entities/portfolio.entity").Portfolio>;
    update(id: string, req: any, data: {
        title?: string;
        summary?: string;
        content?: string;
        skills?: string;
        keywords?: string;
        sections?: string;
        isPrivate?: string;
    }, photo?: Express.Multer.File): Promise<import("../entities/portfolio.entity").Portfolio>;
    remove(id: string, req: any): Promise<void>;
}
