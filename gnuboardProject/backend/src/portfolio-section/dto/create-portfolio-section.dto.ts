export class CreatePortfolioSectionDto {
  portfolioId: number;
  type: 'experience' | 'project' | 'certificate' | 'language' | 'activity';
  content: string;
} 