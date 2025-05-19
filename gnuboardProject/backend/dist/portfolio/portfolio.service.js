"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const portfolio_entity_1 = require("../entities/portfolio.entity");
const portfolio_section_entity_1 = require("../entities/portfolio-section.entity");
const skill_entity_1 = require("../entities/skill.entity");
const keyword_entity_1 = require("../entities/keyword.entity");
const fs = require("fs");
const path = require("path");
let PortfolioService = class PortfolioService {
    portfolioRepository;
    sectionRepository;
    skillRepository;
    keywordRepository;
    constructor(portfolioRepository, sectionRepository, skillRepository, keywordRepository) {
        this.portfolioRepository = portfolioRepository;
        this.sectionRepository = sectionRepository;
        this.skillRepository = skillRepository;
        this.keywordRepository = keywordRepository;
    }
    async findAll() {
        return this.portfolioRepository.find({
            relations: ['user', 'skills', 'keywords', 'sections'],
            order: { id: 'DESC' },
        });
    }
    async findOne(id) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id },
            relations: ['user', 'skills', 'keywords', 'sections'],
        });
        if (!portfolio) {
            throw new common_1.NotFoundException('포트폴리오를 찾을 수 없습니다.');
        }
        return portfolio;
    }
    async create(userId, data) {
        const portfolio = new portfolio_entity_1.Portfolio();
        portfolio.title = data.title;
        portfolio.summary = data.summary;
        portfolio.content = data.content;
        portfolio.is_private = data.isPrivate;
        portfolio.user = { id: userId };
        if (data.skills && data.skills.length > 0) {
            portfolio.skills = await this.skillRepository.findByIds(data.skills);
        }
        if (data.keywords && data.keywords.length > 0) {
            portfolio.keywords = await this.keywordRepository.findByIds(data.keywords);
        }
        if (data.sections && data.sections.length > 0) {
            portfolio.sections = data.sections.map(sectionData => {
                const section = new portfolio_section_entity_1.PortfolioSection();
                section.title = sectionData.title;
                section.content = sectionData.content;
                section.order = sectionData.order;
                return section;
            });
        }
        if (data.photo) {
            const uploadDir = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const filename = `${Date.now()}-${data.photo.originalname}`;
            fs.writeFileSync(path.join(uploadDir, filename), data.photo.buffer);
            portfolio.photo = filename;
        }
        return this.portfolioRepository.save(portfolio);
    }
    async update(id, userId, data) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['skills', 'keywords', 'sections'],
        });
        if (!portfolio) {
            throw new Error('포트폴리오를 찾을 수 없습니다.');
        }
        if (data.title)
            portfolio.title = data.title;
        if (data.summary)
            portfolio.summary = data.summary;
        if (data.content)
            portfolio.content = data.content;
        if (typeof data.isPrivate === 'boolean')
            portfolio.is_private = data.isPrivate;
        if (data.skills) {
            portfolio.skills = await this.skillRepository.findByIds(data.skills);
        }
        if (data.keywords) {
            portfolio.keywords = await this.keywordRepository.findByIds(data.keywords);
        }
        if (data.sections) {
            await this.sectionRepository.delete({ portfolio: { id } });
            portfolio.sections = data.sections.map(sectionData => {
                const section = new portfolio_section_entity_1.PortfolioSection();
                section.title = sectionData.title;
                section.content = sectionData.content;
                section.order = sectionData.order;
                return section;
            });
        }
        if (data.photo) {
            const uploadDir = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            if (portfolio.photo) {
                const oldPhotoPath = path.join(uploadDir, portfolio.photo);
                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            }
            const filename = `${Date.now()}-${data.photo.originalname}`;
            fs.writeFileSync(path.join(uploadDir, filename), data.photo.buffer);
            portfolio.photo = filename;
        }
        return this.portfolioRepository.save(portfolio);
    }
    async remove(id, userId) {
        const portfolio = await this.portfolioRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!portfolio) {
            throw new Error('포트폴리오를 찾을 수 없습니다.');
        }
        if (portfolio.photo) {
            const photoPath = path.join(process.cwd(), 'uploads', portfolio.photo);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }
        await this.portfolioRepository.remove(portfolio);
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(portfolio_entity_1.Portfolio)),
    __param(1, (0, typeorm_1.InjectRepository)(portfolio_section_entity_1.PortfolioSection)),
    __param(2, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __param(3, (0, typeorm_1.InjectRepository)(keyword_entity_1.Keyword)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map