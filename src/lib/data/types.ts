export type SiteSettingsRecord = {
  _id?: string;
  email: string;
  phone: string;
  phoneTel: string;
  serviceArea: string;
  instagramUrl: string;
  facebookUrl: string;
  logoUrl: string;
  tagline: string;
  startingPriceCents: number;
  showPublicPackagePrices: boolean;
  siteName: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  headline: string;
  subheadline: string;
  heroImageUrl: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
};

export type PublicService = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  features?: string[];
  audience: string;
  imageUrl?: string;
  imageAlt?: string;
  order?: number;
  featured?: boolean;
  status: string;
};

export type PublicPackage = {
  _id: string;
  name: string;
  slug: string;
  tier: string;
  priceCents: number;
  durationHours: number;
  shortDescription?: string;
  order?: number;
  active?: boolean;
  showPricePublicly?: boolean;
  inclusions?: Array<{
    label: string;
    needsClientConfirmation?: boolean;
    publiclyVisible?: boolean;
  }>;
  confirmationNotes?: string;
};

export type PublicFaq = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
  status?: string;
};

export type PublicGalleryItem = {
  _id: string;
  imageUrl: string;
  alt: string;
  caption?: string;
  category: string;
  designation: string;
  order?: number;
  status?: string;
};

export type PublicOffer = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  percentageOff?: number;
  eligibility?: string;
  notes?: string;
  visible?: boolean;
  active?: boolean;
};
