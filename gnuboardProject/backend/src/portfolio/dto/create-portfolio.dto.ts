export class CreatePortfolioDto {
  title: string;
  summary: string;
  photo?: Express.Multer.File;
  isPrivate: boolean;
  content?: string;
  sections: any[];
} 