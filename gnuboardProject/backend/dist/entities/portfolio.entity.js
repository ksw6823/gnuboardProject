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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portfolio = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const portfolio_section_entity_1 = require("./portfolio-section.entity");
const skill_entity_1 = require("./skill.entity");
const keyword_entity_1 = require("./keyword.entity");
const like_entity_1 = require("../likes/entities/like.entity");
const comment_entity_1 = require("../comments/entities/comment.entity");
let Portfolio = class Portfolio {
    id;
    title;
    summary;
    content;
    photo;
    is_private;
    user;
    sections;
    skills;
    keywords;
    likes;
    comments;
    created_at;
    updated_at;
};
exports.Portfolio = Portfolio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Portfolio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Portfolio.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Portfolio.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Portfolio.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Portfolio.prototype, "photo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Portfolio.prototype, "is_private", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.portfolios),
    __metadata("design:type", user_entity_1.User)
], Portfolio.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => portfolio_section_entity_1.PortfolioSection, section => section.portfolio),
    __metadata("design:type", Array)
], Portfolio.prototype, "sections", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => skill_entity_1.Skill),
    (0, typeorm_1.JoinTable)({ name: 'portfolio_skills' }),
    __metadata("design:type", Array)
], Portfolio.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => keyword_entity_1.Keyword),
    (0, typeorm_1.JoinTable)({ name: 'portfolio_keywords' }),
    __metadata("design:type", Array)
], Portfolio.prototype, "keywords", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => like_entity_1.Like, like => like.portfolio),
    __metadata("design:type", Array)
], Portfolio.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, comment => comment.portfolio),
    __metadata("design:type", Array)
], Portfolio.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Portfolio.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Portfolio.prototype, "updated_at", void 0);
exports.Portfolio = Portfolio = __decorate([
    (0, typeorm_1.Entity)()
], Portfolio);
//# sourceMappingURL=portfolio.entity.js.map