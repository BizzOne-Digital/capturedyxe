/** Local brand photography — inspiration / setup imagery unless published as client events in admin. */

const img = (name: string) => `/images/${name}`;

export const siteImages = {
  hero: "/hero-booth.jpg",
  boothDetail: img("booth-detail.jpg"),
  boothGalleryArch: img("booth-gallery-arch.jpg"),
  woodenTripod: img("booth-gallery-arch.jpg"),
  weddingBanquet: img("wedding-banquet.jpg"),
  weddingBalloons: img("wedding-balloons.jpg"),
  corporateGala: img("corporate-gala.jpg"),
  milestoneCelebration: img("wedding-balloons.jpg"),
  productLaunch: img("corporate-gala.jpg"),
  schoolGraduation: img("school-graduation.jpg"),
  outdoorFestival: img("outdoor-gazebo.jpg"),
  christmasParty: img("christmas-party.jpg"),
  photoStrips: img("photo-strips.jpg"),
  propsFlatlay: img("props-flatlay.jpg"),
  archBackdrop: img("arch-backdrop.jpg"),
  moodboard: img("moodboard.jpg"),
  photoAlbum: img("photo-album.jpg"),
  keychainStation: img("keychain-station.jpg"),
  acrylicFrames: img("acrylic-frames.jpg"),
  outdoorGazebo: img("outdoor-gazebo.jpg"),
} as const;

export const galleryImages = [
  {
    imageUrl: siteImages.weddingBanquet,
    alt: "Wooden photo booth at an elegant wedding reception",
    caption: "Wedding reception setup",
    category: "wedding",
  },
  {
    imageUrl: siteImages.corporateGala,
    alt: "Photo booth at a corporate gala with warm lighting",
    caption: "Corporate celebration",
    category: "corporate",
  },
  {
    imageUrl: siteImages.weddingBalloons,
    alt: "Photo booth beside a balloon arch and florals",
    caption: "Celebration styling",
    category: "wedding",
  },
  {
    imageUrl: siteImages.boothGalleryArch,
    alt: "Modern wooden booth in a gallery-style space",
    caption: "Modern-retro booth",
    category: "general",
  },
  {
    imageUrl: siteImages.outdoorGazebo,
    alt: "Outdoor photo booth under a garden gazebo",
    caption: "Outdoor events",
    category: "festival",
  },
  {
    imageUrl: siteImages.schoolGraduation,
    alt: "Graduation celebration photo booth setup",
    caption: "Graduation & school events",
    category: "school",
  },
  {
    imageUrl: siteImages.photoStrips,
    alt: "Guests holding printed photo strips",
    caption: "Instant keepsakes",
    category: "general",
  },
  {
    imageUrl: siteImages.archBackdrop,
    alt: "Arched floral backdrop with drapery",
    caption: "Styled backdrops",
    category: "wedding",
  },
  {
    imageUrl: siteImages.christmasParty,
    alt: "Festive holiday photo booth with warm lights",
    caption: "Holiday parties",
    category: "corporate",
  },
  {
    imageUrl: siteImages.acrylicFrames,
    alt: "Acrylic magnetic photo frame keepsakes",
    caption: "Keepsake upgrades",
    category: "general",
  },
  {
    imageUrl: siteImages.keychainStation,
    alt: "Custom photo keychains on display",
    caption: "Keychain station",
    category: "general",
  },
  {
    imageUrl: siteImages.photoAlbum,
    alt: "Photo album with event memories",
    caption: "Album keepsakes",
    category: "wedding",
  },
  {
    imageUrl: siteImages.moodboard,
    alt: "Event inspiration mood board with prints",
    caption: "Personalized templates",
    category: "general",
  },
  {
    imageUrl: siteImages.propsFlatlay,
    alt: "Curated photo booth props on a table",
    caption: "Curated props",
    category: "corporate",
  },
  {
    imageUrl: siteImages.boothDetail,
    alt: "Close-up of wooden photo booth camera and screen",
    caption: "Professional capture",
    category: "general",
  },
];
