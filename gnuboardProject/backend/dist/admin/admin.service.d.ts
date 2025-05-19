import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Portfolio } from '../entities/portfolio.entity';
import { Comment } from '../comments/entities/comment.entity';
export declare class AdminService {
    private usersRepository;
    private portfoliosRepository;
    private commentsRepository;
    constructor(usersRepository: Repository<User>, portfoliosRepository: Repository<Portfolio>, commentsRepository: Repository<Comment>);
    getAllUsers(): Promise<User[]>;
    toggleAdmin(id: number): Promise<User>;
    getAllPortfolios(): Promise<Portfolio[]>;
    deletePortfolio(id: number): Promise<void>;
    getAllComments(): Promise<Comment[]>;
    deleteComment(id: number): Promise<void>;
    deleteUser(id: number): Promise<void>;
}
