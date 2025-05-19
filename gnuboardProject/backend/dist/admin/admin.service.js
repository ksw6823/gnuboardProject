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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const portfolio_entity_1 = require("../entities/portfolio.entity");
const comment_entity_1 = require("../comments/entities/comment.entity");
let AdminService = class AdminService {
    usersRepository;
    portfoliosRepository;
    commentsRepository;
    constructor(usersRepository, portfoliosRepository, commentsRepository) {
        this.usersRepository = usersRepository;
        this.portfoliosRepository = portfoliosRepository;
        this.commentsRepository = commentsRepository;
    }
    async getAllUsers() {
        return this.usersRepository.find({
            select: ['id', 'username', 'name', 'email', 'isAdmin'],
        });
    }
    async toggleAdmin(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        user.isAdmin = !user.isAdmin;
        return this.usersRepository.save(user);
    }
    async getAllPortfolios() {
        return this.portfoliosRepository.find({
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
    }
    async deletePortfolio(id) {
        const portfolio = await this.portfoliosRepository.findOne({ where: { id } });
        if (!portfolio) {
            throw new common_1.NotFoundException('포트폴리오를 찾을 수 없습니다.');
        }
        await this.portfoliosRepository.remove(portfolio);
    }
    async getAllComments() {
        return this.commentsRepository.find({
            relations: ['user', 'portfolio'],
            order: { created_at: 'DESC' },
        });
    }
    async deleteComment(id) {
        const comment = await this.commentsRepository.findOne({ where: { id } });
        if (!comment) {
            throw new common_1.NotFoundException('댓글을 찾을 수 없습니다.');
        }
        await this.commentsRepository.remove(comment);
    }
    async deleteUser(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        await this.usersRepository.remove(user);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(portfolio_entity_1.Portfolio)),
    __param(2, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map