export type SectionDto = {
  type: 'experience' | 'project' | 'certificate' | 'language' | 'activity';
  content: string;
};

export class CreatePortfolioDto {
  title: string;
  photo?: Express.Multer.File;
  is_private: boolean;
  intro: string;
  userId: number;
  views?: number;
  likes_count?: number;
  sections: SectionDto[];
} 