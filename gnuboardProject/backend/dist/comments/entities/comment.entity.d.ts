import { User } from '../../users/entities/user.entity';
import { Portfolio } from '../../entities/portfolio.entity';
export declare class Comment {
    id: number;
    content: string;
    created_at: Date;
    user: User;
    portfolio: Portfolio;
    updatedAt: Date;
}
