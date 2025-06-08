import { SectionDto } from './create-portfolio.dto';

export class UpdatePortfolioDto {
  title?: string;
  is_private?: boolean;
  intro?: string;
  userId?: number;
  views?: number;
  likes_count?: number;
  sections?: SectionDto[];
  jobs?: number[];
  skills?: number[];
  keywords?: number[];
} 