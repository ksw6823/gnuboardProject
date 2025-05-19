import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Portfolio } from '../entities/portfolio.entity';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllUsers(): Promise<User[]>;
    getAllPortfolios(): Promise<Portfolio[]>;
    deleteUser(id: number): Promise<void>;
    deletePortfolio(id: number): Promise<void>;
}
