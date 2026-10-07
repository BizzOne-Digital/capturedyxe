export type PublicationStatus = "draft" | "published" | "archived";

export type EventCategory =
  | "wedding"
  | "corporate"
  | "milestone"
  | "product-launch"
  | "school"
  | "festival"
  | "general";

export type BookingStatus =
  | "new"
  | "contacted"
  | "awaiting_confirmation"
  | "confirmed"
  | "completed"
  | "cancelled";

export type FaqCategory =
  | "booking"
  | "booth-experience"
  | "prints-keepsakes"
  | "event-planning";

export type GalleryDesignation = "event" | "inspiration";

export interface InclusionItem {
  label: string;
  needsClientConfirmation?: boolean;
  publiclyVisible?: boolean;
}

export interface PackageSnapshot {
  packageId: string;
  name: string;
  priceCents: number;
  durationHours: number;
}

export interface AddOnSnapshot {
  addOnId: string;
  name: string;
  priceCents: number;
}

export interface SerializedSiteSettings {
  email: string;
  phone: string;
  phoneTel: string;
  serviceArea: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  logoUrl: string;
  tagline: string;
  startingPriceCents: number;
  showPublicPackagePrices: boolean;
  siteName: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
}
