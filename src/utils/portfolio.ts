import portfolioData from '../data/portfolio.json';

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  social: {
    linkedin: string;
    github: string;
  };
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  projects?: {
    name: string;
    achievements: string[];
  }[];
  achievements?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface AboutInfo {
  summary: string;
  skills: SkillGroup[];
  experience: Experience[];
  education: Education[];
}

export interface PortfolioData {
  personal: PersonalInfo;
  about: AboutInfo;
}

export function getPortfolioData(): PortfolioData {
  return portfolioData as PortfolioData;
}

export function getPersonalInfo(): PersonalInfo {
  return portfolioData.personal as PersonalInfo;
}

export function getAboutInfo(): AboutInfo {
  return portfolioData.about as AboutInfo;
} 