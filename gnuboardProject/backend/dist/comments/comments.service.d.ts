import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsService {
    private commentsRepository;
    constructor(commentsRepository: Repository<Comment>);
    findAllByPortfolio(portfolioId: number): Promise<Comment[]>;
    create(portfolioId: number, userId: number, createCommentDto: CreateCommentDto): Promise<Comment>;
    findAll(portfolioId: number): Promise<Comment[]>;
    update(id: number, userId: number, updateCommentDto: UpdateCommentDto): Promise<Comment>;
    remove(id: number, userId: number): Promise<void>;
}
