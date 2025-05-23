import portfolioData from '../data/portfolio.json';

export type PortfolioData = typeof portfolioData;

export function getPortfolioData(): PortfolioData {
  return portfolioData;
}

export function getPersonalInfo() {
  return portfolioData.personal;
}

export function getNavigation() {
  return portfolioData.navigation;
}

export function getProjects() {
  return portfolioData.projects;
}

export function getAboutInfo() {
  return portfolioData.about;
}

export function getCVInfo() {
  return portfolioData.cv;
} 