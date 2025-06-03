import { SectionDto } from './create-portfolio.dto';

export class UpdatePortfolioDto {
  title?: string;
  photo?: Express.Multer.File;
  is_private?: boolean;
  intro?: string;
  userId?: number;
  views?: number;
  likes_count?: number;
  sections?: SectionDto[];
} 