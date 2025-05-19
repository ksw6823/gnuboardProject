import { User } from '../../users/entities/user.entity';
import { Portfolio } from '../../entities/portfolio.entity';
export declare class Like {
    id: number;
    created_at: Date;
    user: User;
    portfolio: Portfolio;
}
