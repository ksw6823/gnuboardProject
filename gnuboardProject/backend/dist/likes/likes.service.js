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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const like_entity_1 = require("./entities/like.entity");
let LikesService = class LikesService {
    likesRepository;
    constructor(likesRepository) {
        this.likesRepository = likesRepository;
    }
    async toggleLike(portfolioId, userId) {
        const existingLike = await this.likesRepository.findOne({
            where: {
                portfolio: { id: portfolioId },
                user: { id: userId },
            },
        });
        if (existingLike) {
            await this.likesRepository.remove(existingLike);
            return { liked: false };
        }
        const like = this.likesRepository.create({
            portfolio: { id: portfolioId },
            user: { id: userId },
        });
        await this.likesRepository.save(like);
        return { liked: true };
    }
    async getLikeCount(portfolioId) {
        return this.likesRepository.count({
            where: { portfolio: { id: portfolioId } },
        });
    }
    async hasLiked(portfolioId, userId) {
        const like = await this.likesRepository.findOne({
            where: {
                portfolio: { id: portfolioId },
                user: { id: userId },
            },
        });
        return !!like;
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LikesService);
//# sourceMappingURL=likes.service.js.map