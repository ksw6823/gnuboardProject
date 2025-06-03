export class UpdatePortfolioSectionDto {
  portfolioId?: number;
  type?: 'experience' | 'project' | 'certificate' | 'language' | 'activity';
  content?: string;
} 