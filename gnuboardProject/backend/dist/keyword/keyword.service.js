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
exports.KeywordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const keyword_entity_1 = require("../entities/keyword.entity");
let KeywordService = class KeywordService {
    keywordRepository;
    constructor(keywordRepository) {
        this.keywordRepository = keywordRepository;
    }
    findAll() {
        return this.keywordRepository.find();
    }
    findOne(id) {
        return this.keywordRepository.findOne({ where: { id } });
    }
    create(data) {
        const keyword = this.keywordRepository.create(data);
        return this.keywordRepository.save(keyword);
    }
    async update(id, data) {
        await this.keywordRepository.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        await this.keywordRepository.delete(id);
    }
};
exports.KeywordService = KeywordService;
exports.KeywordService = KeywordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(keyword_entity_1.Keyword)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], KeywordService);
//# sourceMappingURL=keyword.service.js.map