"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const portfolio_module_1 = require("./portfolio/portfolio.module");
const skill_module_1 = require("./skill/skill.module");
const keyword_module_1 = require("./keyword/keyword.module");
const comments_module_1 = require("./comments/comments.module");
const likes_module_1 = require("./likes/likes.module");
const admin_module_1 = require("./admin/admin.module");
const user_entity_1 = require("./users/entities/user.entity");
const portfolio_entity_1 = require("./entities/portfolio.entity");
const comment_entity_1 = require("./comments/entities/comment.entity");
const like_entity_1 = require("./likes/entities/like.entity");
const skill_entity_1 = require("./entities/skill.entity");
const keyword_entity_1 = require("./entities/keyword.entity");
const portfolio_section_entity_1 = require("./entities/portfolio-section.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [user_entity_1.User, portfolio_entity_1.Portfolio, comment_entity_1.Comment, like_entity_1.Like, skill_entity_1.Skill, keyword_entity_1.Keyword, portfolio_section_entity_1.PortfolioSection],
                    synchronize: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            portfolio_module_1.PortfolioModule,
            skill_module_1.SkillModule,
            keyword_module_1.KeywordModule,
            comments_module_1.CommentsModule,
            likes_module_1.LikesModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map