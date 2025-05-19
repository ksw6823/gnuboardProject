import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
    }>;
    findByUsername(username: string): Promise<User | undefined>;
    create(userData: Partial<User>): Promise<User>;
    findOne(id: number): Promise<User>;
    findUserPortfolios(id: number): Promise<import("../entities/portfolio.entity").Portfolio[]>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    updateProfile(id: number, data: {
        name?: string;
        email?: string;
        profileImage?: string;
        currentPassword?: string;
        newPassword?: string;
    }): Promise<User>;
    changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<void>;
    remove(id: number): Promise<void>;
    validateUser(username: string, password: string): Promise<User | null>;
    updateUserRole(id: number, isAdmin: boolean, admin: User): Promise<User>;
    deleteUser(id: number, admin: User): Promise<void>;
}
