import { Portfolio } from '../../entities/portfolio.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../likes/entities/like.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    profileImage: string;
    isAdmin: boolean;
    created_at: Date;
    updated_at: Date;
    portfolios: Portfolio[];
    comments: Comment[];
    likes: Like[];
}
