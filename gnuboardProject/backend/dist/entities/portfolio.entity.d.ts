import { User } from '../users/entities/user.entity';
import { PortfolioSection } from './portfolio-section.entity';
import { Skill } from './skill.entity';
import { Keyword } from './keyword.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
export declare class Portfolio {
    id: number;
    title: string;
    summary: string;
    content: string;
    photo: string;
    is_private: boolean;
    user: User;
    sections: PortfolioSection[];
    skills: Skill[];
    keywords: Keyword[];
    likes: Like[];
    comments: Comment[];
    created_at: Date;
    updated_at: Date;
}
