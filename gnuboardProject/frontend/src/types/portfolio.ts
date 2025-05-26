export interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    introduction: string;
    profileImage: string;
  };
  skills: Array<{
    name: string;
    level?: string;
  }>;
  experiences: Array<{
    title: string;
    company: string;
    date: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    date: string;
    description: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages: Array<{
    name: string;
    level: string;
  }>;
  activities: Array<{
    title: string;
    description: string;
  }>;
} 