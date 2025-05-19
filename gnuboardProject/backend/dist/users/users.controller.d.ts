import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMyProfile(req: any): Promise<import("./entities/user.entity").User>;
    getMyPortfolios(req: any): Promise<import("../entities/portfolio.entity").Portfolio[]>;
    updateMyProfile(req: any, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<void>;
    deleteAccount(req: any): Promise<void>;
    updateProfile(req: any, updateProfileDto: {
        name?: string;
        email?: string;
        profileImage?: string;
        currentPassword?: string;
        newPassword?: string;
    }): Promise<import("./entities/user.entity").User>;
    findAll(req: any, query: {
        page?: number;
        limit?: number;
    }): Promise<{
        users: import("./entities/user.entity").User[];
        total: number;
    }>;
    updateUserRole(id: number, data: {
        isAdmin: boolean;
    }, req: any): Promise<import("./entities/user.entity").User>;
    deleteUser(id: number, req: any): Promise<void>;
    getProfile(req: any): Promise<import("./entities/user.entity").User>;
}
