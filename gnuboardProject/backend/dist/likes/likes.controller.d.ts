import { LikesService } from './likes.service';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    toggleLike(portfolioId: string, req: any): Promise<{
        liked: boolean;
    }>;
    getLikeCount(portfolioId: string): Promise<number>;
    hasLiked(portfolioId: string, req: any): Promise<boolean>;
}
