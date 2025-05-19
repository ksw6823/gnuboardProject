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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./entities/comment.entity");
let CommentsService = class CommentsService {
    commentsRepository;
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    async findAllByPortfolio(portfolioId) {
        return this.commentsRepository.find({
            where: { portfolio: { id: portfolioId } },
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
    }
    async create(portfolioId, userId, createCommentDto) {
        const comment = this.commentsRepository.create({
            ...createCommentDto,
            portfolio: { id: portfolioId },
            user: { id: userId },
        });
        return this.commentsRepository.save(comment);
    }
    async findAll(portfolioId) {
        return this.commentsRepository.find({
            where: { portfolio: { id: portfolioId } },
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
    }
    async update(id, userId, updateCommentDto) {
        const comment = await this.commentsRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!comment) {
            throw new common_1.NotFoundException('댓글을 찾을 수 없습니다.');
        }
        Object.assign(comment, updateCommentDto);
        return this.commentsRepository.save(comment);
    }
    async remove(id, userId) {
        const comment = await this.commentsRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!comment) {
            throw new common_1.NotFoundException('댓글을 찾을 수 없습니다.');
        }
        await this.commentsRepository.remove(comment);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map