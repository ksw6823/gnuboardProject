export type SectionDto = {
  type: 'education' | 'experience' | 'project' | 'certificate' | 'language' | 'activity';
  content: string;
};

export class CreatePortfolioDto {
  title: string;
  is_private: boolean;
  intro: string;
  userId: number;
  views?: number;
  likes_count?: number;
  sections: SectionDto[];
  jobs?: number[];
  skills?: number[];
  keywords?: number[];
} 