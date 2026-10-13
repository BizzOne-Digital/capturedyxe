import { BRAND_EMAIL } from "@/lib/brand";
import { eventGalleryToPreviewItems } from "@/lib/event-gallery";
import { galleryImages, siteImages } from "@/lib/site-images";

/** Read-only fallback when MONGODB_URI is not configured (local preview only). */

export const PREVIEW_MODE = !process.env.MONGODB_URI;

export const previewSettings = {
  _id: "preview",
  email: BRAND_EMAIL,
  phone: "+1 639 480 6206",
  phoneTel: "tel:+16394806206",
  serviceArea: "Saskatoon, Saskatchewan and surrounding areas by arrangement.",
  instagramUrl: "",
  facebookUrl: "",
  logoUrl: "/logo/Captured-yxe-lockup.png",
  tagline: "VINTAGE SOUL, INSTANT ROLL",
  startingPriceCents: 40000,
  showPublicPackagePrices: true,
  siteName: "Captured.YXE",
  defaultSeoTitle: "Captured.YXE | Saskatoon Photo Booth Rentals",
  defaultSeoDescription:
    "Saskatoon's go-to photo booth experience for weddings, corporate events, and celebrations.",
  headline: "Capture Moments into Memories.",
  subheadline:
    "Saskatoon's go-to photo booth experience for weddings, corporate events, and celebrations.",
  heroImageUrl: "/hero-booth.jpg",
  ctaPrimaryLabel: "Check Availability",
  ctaSecondaryLabel: "Explore the Experience",
};

export const previewPackages = [
  {
    _id: "pkg-standard",
    name: "Standard",
    slug: "standard",
    tier: "standard",
    priceCents: 40000,
    durationHours: 2,
    shortDescription: "Digital copies, backdrops, props, and customized templates for two hours.",
    order: 0,
    active: true,
    showPricePublicly: true,
    confirmationNotes: "",
    inclusions: [
      { label: "Digital photo copies for 2 hours", publiclyVisible: true },
      { label: "Backdrops", publiclyVisible: true },
      { label: "Props", publiclyVisible: true },
      { label: "2×6 or 4×6 print sizes", publiclyVisible: true },
      { label: "On-site tech support", publiclyVisible: true },
      { label: "2 customized templates", publiclyVisible: true },
    ],
  },
  {
    _id: "pkg-signature",
    name: "Signature",
    slug: "signature",
    tier: "signature",
    priceCents: 60000,
    durationHours: 3,
    shortDescription:
      "Three hours with instant prints, three templates, and magnetic adhesive sheets included.",
    order: 1,
    active: true,
    showPricePublicly: true,
    confirmationNotes: "",
    inclusions: [
      { label: "Instant prints for 3 hours", publiclyVisible: true },
      { label: "Backdrops", publiclyVisible: true },
      { label: "Props", publiclyVisible: true },
      { label: "2×6 or 4×6 print sizes", publiclyVisible: true },
      { label: "On-site tech support", publiclyVisible: true },
      { label: "3 customized templates", publiclyVisible: true },
      { label: "Magnetic adhesive sheets (2×6 or 4×6)", publiclyVisible: true },
    ],
  },
  {
    _id: "pkg-elite",
    name: "Elite",
    slug: "elite",
    tier: "elite",
    priceCents: 80000,
    durationHours: 4,
    shortDescription:
      "Four hours with dedication template, magnetic sheets, and a guest book with engraved names and date.",
    order: 2,
    active: true,
    showPricePublicly: true,
    confirmationNotes: "",
    inclusions: [
      { label: "Instant prints for 4 hours", publiclyVisible: true },
      { label: "Backdrops", publiclyVisible: true },
      { label: "Props", publiclyVisible: true },
      { label: "2×6 or 4×6 print sizes", publiclyVisible: true },
      { label: "On-site tech support", publiclyVisible: true },
      { label: "4 customized templates", publiclyVisible: true },
      { label: "Dedication template", publiclyVisible: true },
      { label: "Magnetic adhesive sheets (2×6 or 4×6)", publiclyVisible: true },
      { label: "Customized guest book — engraved names and date", publiclyVisible: true },
    ],
  },
];

export const previewAddOns = [
  {
    _id: "addon-frame",
    name: "Acrylic magnetic photo frame upgrade",
    slug: "acrylic-magnetic-frame",
    priceCents: 30000,
    description:
      "Standard package add-on — upgrade to an acrylic magnetic photo frame (2×6 or 4×6).",
    needsClientConfirmation: false,
    active: true,
    showPricePublicly: true,
    order: 0,
  },
  {
    _id: "addon-keychain",
    name: "Keychain station",
    slug: "keychain-station",
    priceCents: 30000,
    description: "Signature package add-on — keychain station with 1×3 keepsakes for guests.",
    needsClientConfirmation: false,
    active: true,
    showPricePublicly: true,
    order: 1,
  },
];

export const previewServices = [
  {
    _id: "svc-weddings",
    title: "Weddings",
    slug: "weddings",
    summary: "Timeless strips and warm lighting for your biggest day.",
    description:
      "From elegant templates to guest-friendly flow, our booth complements your venue styling while guests leave with keepsakes.",
    features: ["Custom overlays", "Styled backdrops", "Prints & digital sharing"],
    audience: "wedding",
    imageUrl: siteImages.weddingBanquet,
    imageAlt: "Wooden photo booth at an elegant wedding reception",
    order: 0,
    featured: true,
    status: "published",
  },
  {
    _id: "svc-corporate",
    title: "Corporate Events",
    slug: "corporate-events",
    summary: "On-brand templates and polished guest experiences.",
    description:
      "Product launches, galas, and team celebrations with professional on-site support and clean aesthetic setups.",
    features: ["Brand templates", "Guest engagement", "Technical support"],
    audience: "corporate",
    imageUrl: siteImages.corporateGala,
    imageAlt: "Photo booth at a corporate gala with warm lighting",
    order: 1,
    featured: true,
    status: "published",
  },
  {
    _id: "svc-milestone",
    title: "Milestone Celebrations",
    slug: "milestone-celebrations",
    summary: "Birthdays, anniversaries, and family gatherings made tangible.",
    description:
      "Curated props and personalized templates help your celebration feel unmistakably yours.",
    features: ["Custom props", "Personalized templates", "Instant memories"],
    audience: "milestone",
    imageUrl: siteImages.weddingBalloons,
    imageAlt: "Photo booth beside balloon arch and florals",
    order: 2,
    featured: false,
    status: "published",
  },
  {
    _id: "svc-launch",
    title: "Product Launches",
    slug: "product-launches",
    summary: "Energy and shareable moments for your launch night.",
    description:
      "Highlight your brand with tailored photo strip designs and a setup that photographs beautifully.",
    features: ["Launch templates", "Styled setup", "Digital copies"],
    audience: "product-launch",
    imageUrl: siteImages.corporateGala,
    imageAlt: "Photo booth at a product launch celebration",
    order: 3,
    featured: false,
    status: "published",
  },
  {
    _id: "svc-school",
    title: "School Events",
    slug: "school-events",
    summary: "Fun, fast-paced booths for grads, dances, and fundraisers.",
    description:
      "High-energy guest flow with durable props and templates suited to school spirit.",
    features: ["Fast guest flow", "School-themed templates", "On-site support"],
    audience: "school",
    imageUrl: siteImages.schoolGraduation,
    imageAlt: "Graduation celebration photo booth setup",
    order: 4,
    featured: false,
    status: "published",
  },
  {
    _id: "svc-festival",
    title: "Public Festivals",
    slug: "public-festivals",
    summary: "Crowd-ready experiences for community celebrations.",
    description:
      "Robust setups built for festivals and public events across the YXE region.",
    features: ["Festival-ready setup", "High throughput", "Custom branding"],
    audience: "festival",
    imageUrl: siteImages.outdoorGazebo,
    imageAlt: "Outdoor photo booth under a garden gazebo",
    order: 5,
    featured: false,
    status: "published",
  },
];

export const previewTestimonials = [
  {
    _id: "tm-wedding-1",
    reviewerName: "Sarah & Michael T.",
    quote:
      "Our guests could not stay away from the booth — the wooden setup looked beautiful beside our florals, and the custom strip with our names felt so personal. Prints were ready in seconds and we still have a pile on our coffee table months later.",
    rating: 5,
    eventCategory: "wedding",
    order: 0,
    status: "published",
  },
  {
    _id: "tm-wedding-2",
    reviewerName: "Priya K.",
    quote:
      "Captured.YXE handled our reception timeline perfectly. The lighting was flattering in a dim ballroom, the host kept the line moving, and our families loved having something tangible to take home instead of another phone photo lost in the cloud.",
    rating: 5,
    eventCategory: "wedding",
    order: 1,
    status: "published",
  },
  {
    _id: "tm-corporate-1",
    reviewerName: "Jordan M., Event Lead — Prairie Tech Co.",
    quote:
      "We needed on-brand strips for a product launch in Saskatoon and they delivered. Logo placement was crisp, setup was discreet but polished, and our team used the digital gallery for social posts the next morning.",
    rating: 5,
    eventCategory: "corporate",
    order: 2,
    status: "published",
  },
  {
    _id: "tm-corporate-2",
    reviewerName: "Linda H., Office Manager",
    quote:
      "Our holiday party booth was the highlight of the night. Props were tasteful, not cheesy, and the attendant was professional with executives and plus-ones alike. Booking again for our summer staff event.",
    rating: 5,
    eventCategory: "corporate",
    order: 3,
    status: "published",
  },
  {
    _id: "tm-milestone-1",
    reviewerName: "The Okoye Family",
    quote:
      "For my parents’ 40th anniversary we wanted something interactive that every generation would enjoy. The booth delivered — grandparents, teens, and little cousins all posed together and left with strips they still talk about.",
    rating: 5,
    eventCategory: "milestone",
    order: 4,
    status: "published",
  },
  {
    _id: "tm-school-1",
    reviewerName: "Mr. Daniels, Grad Committee",
    quote:
      "Grad night was hectic and they made it easy — fast flow, durable props, and a template that matched our school colours. Lines stayed short even when everyone rushed the booth after the ceremony.",
    rating: 5,
    eventCategory: "school",
    order: 5,
    status: "published",
  },
  {
    _id: "tm-festival-1",
    reviewerName: "Riverbank Community Association",
    quote:
      "Outdoor festival conditions can be tricky, but the setup held up through an afternoon of wind and foot traffic. Families lined up all day and the strips became little souvenirs people carried around the grounds.",
    rating: 5,
    eventCategory: "festival",
    order: 6,
    status: "published",
  },
  {
    _id: "tm-general-1",
    reviewerName: "Amanda & Chris L.",
    quote:
      "From the first email to teardown, communication was clear and the experience felt premium. The modern-retro booth matched our venue aesthetic and every guest commented on how good the photos looked.",
    rating: 5,
    eventCategory: "general",
    order: 7,
    status: "published",
  },
];

export const previewFaqs = [
  {
    _id: "faq-1",
    question: "How do I check availability for my event date?",
    answer:
      "Submit a booking request with your preferred date and details. Our team will contact you to confirm availability — requests do not reserve a date automatically.",
    category: "booking",
    order: 0,
    status: "published",
  },
  {
    _id: "faq-2",
    question: "What is included in a photo booth rental?",
    answer:
      "Packages include booth time, backdrops, props, customized templates, on-site technical support, and digital photo copies. Print options and keepsakes vary by package — see Pricing or ask us to help you choose.",
    category: "booth-experience",
    order: 0,
    status: "published",
  },
  {
    _id: "faq-3",
    question: "Can guests get physical prints and digital copies?",
    answer:
      "Yes — packages are designed around tangible keepsakes and digital sharing. Specific print inclusions depend on your selected package; magnetic backing is included on Signature and Elite, and Elite includes a customized guest book with engraved names and date.",
    category: "prints-keepsakes",
    order: 0,
    status: "published",
  },
  {
    _id: "faq-4",
    question: "Do you travel outside Saskatoon?",
    answer:
      "We are based in Saskatoon and serve surrounding areas by arrangement. Share your venue city in your enquiry and we will confirm travel details with you.",
    category: "event-planning",
    order: 0,
    status: "published",
  },
  {
    _id: "faq-5",
    question: "What about deposits, cancellations, or outdoor setup requirements?",
    answer:
      "We are happy to walk you through policies and venue requirements — please enquire so we can share approved details for your event.",
    category: "booking",
    order: 1,
    status: "published",
  },
];

const inspirationGallery = galleryImages.map((item, index) => ({
  _id: `gal-insp-${index + 1}`,
  imageUrl: item.imageUrl,
  alt: item.alt,
  caption: item.caption,
  category: item.category,
  designation: "inspiration" as const,
  order: index,
  status: "published" as const,
}));

const eventGallery = eventGalleryToPreviewItems().map((item, index) => ({
  _id: `gal-event-${index + 1}`,
  imageUrl: item.imageUrl,
  alt: item.alt,
  caption: item.caption,
  category: item.category,
  designation: item.designation,
  order: inspirationGallery.length + index,
  status: "published" as const,
}));

export const previewGallery = [...eventGallery, ...inspirationGallery];

export const previewOffer = {
  _id: "offer-christmas",
  title: "Christmas Party Offer",
  slug: "christmas-party",
  description: "10% off Christmas party package bookings.",
  percentageOff: 10,
  eligibility: "Christmas party events — eligibility and dates subject to confirmation.",
  notes: "Discount is applied manually after eligibility is confirmed.",
  visible: true,
  active: true,
};
