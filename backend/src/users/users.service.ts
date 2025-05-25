import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.usersRepository.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { users, total };
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user || undefined;
  }

  // 이 함수는 반드시 해시된 비밀번호만 받아야 합니다! (authService.register에서만 호출)
  async create(userData: Partial<User>): Promise<User> {
    // username 중복 체크
    if (userData.username) {
      const existingUser = await this.findByUsername(userData.username);
      if (existingUser) {
        throw new BadRequestException('이미 존재하는 사용자명입니다.');
      }
    }
    // 간단한 해시 체크 (bcrypt 해시는 $2로 시작)
    if (userData.password && !userData.password.startsWith('$2')) {
      throw new BadRequestException('비밀번호는 반드시 해시된 값이어야 합니다.');
    }
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async findUserPortfolios(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['portfolios'],
    });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user.portfolios;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async updateProfile(
    id: number,
    data: {
      name?: string;
      email?: string;
      profileImage?: string;
      currentPassword?: string;
      newPassword?: string;
    },
  ): Promise<User> {
    const user = await this.findOne(id);
    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new BadRequestException('현재 비밀번호를 입력해주세요.');
      }
      const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('현재 비밀번호가 일치하지 않습니다.');
      }
      user.password = await bcrypt.hash(data.newPassword, 10);
    }
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.profileImage) user.profileImage = data.profileImage;
    return this.usersRepository.save(user);
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.findOne(id);
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('현재 비밀번호가 일치하지 않습니다.');
    }
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async updateUserRole(id: number, isAdmin: boolean, admin: User): Promise<User> {
    if (!admin.isAdmin) {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }
    const user = await this.findOne(id);
    user.isAdmin = isAdmin;
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number, admin: User): Promise<void> {
    if (!admin.isAdmin) {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }
    const user = await this.findOne(id);
    if (user.isAdmin) {
      throw new BadRequestException('관리자는 삭제할 수 없습니다.');
    }
    await this.usersRepository.remove(user);
  }
} 