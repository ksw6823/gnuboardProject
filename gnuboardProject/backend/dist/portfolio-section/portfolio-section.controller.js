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
exports.PortfolioSectionController = void 0;
const common_1 = require("@nestjs/common");
const portfolio_section_service_1 = require("./portfolio-section.service");
let PortfolioSectionController = class PortfolioSectionController {
    sectionService;
    constructor(sectionService) {
        this.sectionService = sectionService;
    }
    findAll() {
        return this.sectionService.findAll();
    }
    findOne(id) {
        return this.sectionService.findOne(Number(id));
    }
    create(data) {
        return this.sectionService.create(data);
    }
    update(id, data) {
        return this.sectionService.update(Number(id), data);
    }
    remove(id) {
        return this.sectionService.remove(Number(id));
    }
};
exports.PortfolioSectionController = PortfolioSectionController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PortfolioSectionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PortfolioSectionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PortfolioSectionController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PortfolioSectionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PortfolioSectionController.prototype, "remove", null);
exports.PortfolioSectionController = PortfolioSectionController = __decorate([
    (0, common_1.Controller)('portfolio-sections'),
    __metadata("design:paramtypes", [portfolio_section_service_1.PortfolioSectionService])
], PortfolioSectionController);
//# sourceMappingURL=portfolio-section.controller.js.map