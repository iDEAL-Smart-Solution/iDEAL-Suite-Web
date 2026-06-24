// ── Request types ──────────────────────────────────────────────────────────────

export type LandingPageFeatureRequest = {
  title: string;
  description: string;
  icon?: string;
  displayOrder: number;
};

export type LandingPageProgramRequest = {
  name: string;
  description: string;
  icon?: string;
  displayOrder: number;
};

export type LandingPageStatisticRequest = {
  value: string;
  label: string;
  displayOrder: number;
};

export type LandingPageCoreValueRequest = {
  value: string;
  displayOrder: number;
};

export type LandingPageContactRequest = {
  email?: string;
  phone?: string;
  address?: string;
  portalUrl?: string;
  description?: string;
};

export type LandingPageRequest = {
  logoUrl: string;
  domainName: string;
  themeColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: string;
  about: string;
  aboutImage?: string;
  secondaryImage?: string;
  mission?: string;
  vision?: string;
  portalLink?: string;
  footerCopyright?: string;
  footerCompanyName?: string;
  features: LandingPageFeatureRequest[];
  programs: LandingPageProgramRequest[];
  statistics: LandingPageStatisticRequest[];
  coreValues: LandingPageCoreValueRequest[];
  contact?: LandingPageContactRequest;
  cta?: LandingPageCtaRequest;
};

export type LandingPageCtaRequest = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
};

// ── Response types ─────────────────────────────────────────────────────────────

export type LandingPageFeatureResponse = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  displayOrder: number;
};

export type LandingPageProgramResponse = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  displayOrder: number;
};

export type LandingPageStatisticResponse = {
  id: string;
  value: string;
  label: string;
  displayOrder: number;
};

export type LandingPageCoreValueResponse = {
  id: string;
  value: string;
  displayOrder: number;
};

export type LandingPageContactResponse = {
  id: string;
  email?: string;
  phone?: string;
  address?: string;
  portalUrl?: string;
  description?: string;
};

export type LandingPageCtaResponse = {
  id: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
};

export type LandingPageResponse = {
  id: string;
  schoolId: string;
  logoUrl: string;
  domainName: string;
  themeColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: string;
  about: string;
  aboutImage?: string;
  secondaryImage?: string;
  mission?: string;
  vision?: string;
  portalLink?: string;
  footerCopyright?: string;
  footerCompanyName?: string;
  features: LandingPageFeatureResponse[];
  programs: LandingPageProgramResponse[];
  statistics: LandingPageStatisticResponse[];
  coreValues: LandingPageCoreValueResponse[];
  contact?: LandingPageContactResponse;
  cta?: LandingPageCtaResponse;
  createdAt: string;
  lastUpdated: string;
};
