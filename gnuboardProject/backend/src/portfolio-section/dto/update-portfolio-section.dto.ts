export class UpdatePortfolioSectionDto {
  portfolioId?: number;
  type?: 'education' | 'experience' | 'project' | 'certificate' | 'language' | 'activity';
  content?: string;
} 