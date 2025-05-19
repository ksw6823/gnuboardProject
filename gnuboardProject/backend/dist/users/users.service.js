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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAll(page = 1, limit = 10) {
        const [users, total] = await this.usersRepository.findAndCount({
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { users, total };
    }
    async findByUsername(username) {
        const user = await this.usersRepository.findOne({ where: { username } });
        return user || undefined;
    }
    async create(userData) {
        if (userData.username) {
            const existingUser = await this.findByUsername(userData.username);
            if (existingUser) {
                throw new common_1.BadRequestException('이미 존재하는 사용자명입니다.');
            }
        }
        if (userData.password && !userData.password.startsWith('$2')) {
            throw new common_1.BadRequestException('비밀번호는 반드시 해시된 값이어야 합니다.');
        }
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return user;
    }
    async findUserPortfolios(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['portfolios'],
        });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return user.portfolios;
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async updateProfile(id, data) {
        const user = await this.findOne(id);
        if (data.newPassword) {
            if (!data.currentPassword) {
                throw new common_1.BadRequestException('현재 비밀번호를 입력해주세요.');
            }
            const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
            if (!isPasswordValid) {
                throw new common_1.BadRequestException('현재 비밀번호가 일치하지 않습니다.');
            }
            user.password = await bcrypt.hash(data.newPassword, 10);
        }
        if (data.name)
            user.name = data.name;
        if (data.email)
            user.email = data.email;
        if (data.profileImage)
            user.profileImage = data.profileImage;
        return this.usersRepository.save(user);
    }
    async changePassword(id, changePasswordDto) {
        const user = await this.findOne(id);
        const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('현재 비밀번호가 일치하지 않습니다.');
        }
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        user.password = hashedPassword;
        await this.usersRepository.save(user);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
    async validateUser(username, password) {
        const user = await this.findByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
    async updateUserRole(id, isAdmin, admin) {
        if (!admin.isAdmin) {
            throw new common_1.ForbiddenException('관리자 권한이 필요합니다.');
        }
        const user = await this.findOne(id);
        user.isAdmin = isAdmin;
        return this.usersRepository.save(user);
    }
    async deleteUser(id, admin) {
        if (!admin.isAdmin) {
            throw new common_1.ForbiddenException('관리자 권한이 필요합니다.');
        }
        const user = await this.findOne(id);
        if (user.isAdmin) {
            throw new common_1.BadRequestException('관리자는 삭제할 수 없습니다.');
        }
        await this.usersRepository.remove(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map