import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    register(data: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): any;
}
