import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(portfolioId: string, req: any, createCommentDto: CreateCommentDto): Promise<import("./entities/comment.entity").Comment>;
    findAll(portfolioId: string): Promise<import("./entities/comment.entity").Comment[]>;
    update(id: string, req: any, updateCommentDto: UpdateCommentDto): Promise<import("./entities/comment.entity").Comment>;
    remove(id: string, req: any): Promise<void>;
}
