import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
export declare class LikesService {
    private likesRepository;
    constructor(likesRepository: Repository<Like>);
    toggleLike(portfolioId: number, userId: number): Promise<{
        liked: boolean;
    }>;
    getLikeCount(portfolioId: number): Promise<number>;
    hasLiked(portfolioId: number, userId: number): Promise<boolean>;
}
