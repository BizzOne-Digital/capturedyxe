"use client";

import {
  ResourceManager,
  STATUS_OPTIONS,
  EVENT_CATEGORY_OPTIONS,
  type Field,
} from "@/components/admin/ResourceManager";

const str = (v: unknown) => (v == null ? "" : String(v));

const ORDER_FIELD: Field = {
  key: "order",
  label: "Display order",
  type: "number",
  half: true,
  help: "Lower numbers show first (1, 2, 3...).",
};

const STATUS_FIELD: Field = {
  key: "status",
  label: "Visibility",
  type: "select",
  options: STATUS_OPTIONS,
  half: true,
};

/* ---------------------------------- Services --------------------------------- */

export function ServicesManager() {
  return (
    <ResourceManager
      title="Services"
      noun="service"
      intro="The experiences you offer. Published services appear on the Services page."
      apiUrl="/api/admin/services"
      thumbKey="imageUrl"
      statusKey="status"
      itemTitle={(i) => str(i.title)}
      itemSubtitle={(i) => str(i.summary)}
      defaults={{ status: "published", audience: "general", order: 1 }}
      fields={[
        { key: "title", label: "Service name", type: "text", required: true },
        {
          key: "summary",
          label: "Short summary",
          type: "text",
          required: true,
          help: "One sentence shown in lists.",
        },
        {
          key: "description",
          label: "Full description",
          type: "textarea",
          required: true,
          rows: 6,
        },
        {
          key: "features",
          label: "What is included",
          type: "lines",
          help: "Type one point per line.",
        },
        {
          key: "audience",
          label: "Best for",
          type: "select",
          options: EVENT_CATEGORY_OPTIONS,
          half: true,
        },
        { key: "imageUrl", label: "Service photo", type: "image", folder: "products" },
        {
          key: "imageAlt",
          label: "Photo description",
          type: "text",
          help: "Short description of the photo for people who cannot see it.",
        },
        ORDER_FIELD,
        STATUS_FIELD,
        {
          key: "featured",
          label: "Featured",
          type: "checkbox",
          checkboxLabel: "Highlight this service",
        },
      ]}
    />
  );
}

/* ---------------------------------- Gallery ---------------------------------- */

export function GalleryManager() {
  return (
    <ResourceManager
      title="Gallery"
      noun="photo"
      intro="Photos shown in the website gallery."
      apiUrl="/api/admin/gallery"
      thumbKey="imageUrl"
      statusKey="status"
      itemTitle={(i) => str(i.alt) || str(i.caption)}
      itemSubtitle={(i) => str(i.category)}
      defaults={{ status: "published", category: "general", designation: "event", order: 1 }}
      fields={[
        { key: "imageUrl", label: "Photo", type: "image", folder: "gallery", required: true },
        {
          key: "alt",
          label: "Photo description",
          type: "text",
          required: true,
          help: "Example: Bride and groom laughing in the photo booth.",
        },
        { key: "caption", label: "Caption (optional)", type: "text" },
        {
          key: "category",
          label: "Event type",
          type: "select",
          options: EVENT_CATEGORY_OPTIONS,
          half: true,
        },
        {
          key: "designation",
          label: "Photo type",
          type: "select",
          half: true,
          options: [
            { value: "event", label: "Real event photo" },
            { value: "inspiration", label: "Inspiration photo" },
          ],
        },
        ORDER_FIELD,
        STATUS_FIELD,
      ]}
    />
  );
}

/* ----------------------------------- FAQs ------------------------------------ */

export function FaqsManager() {
  return (
    <ResourceManager
      title="FAQs"
      noun="question"
      intro="Common questions and answers shown on the FAQ page."
      apiUrl="/api/admin/faqs"
      statusKey="status"
      itemTitle={(i) => str(i.question)}
      itemSubtitle={(i) => str(i.category).replace(/-/g, " ")}
      defaults={{ status: "published", category: "booking", order: 1 }}
      fields={[
        { key: "question", label: "Question", type: "text", required: true },
        { key: "answer", label: "Answer", type: "textarea", required: true, rows: 5 },
        {
          key: "category",
          label: "Topic",
          type: "select",
          half: true,
          options: [
            { value: "booking", label: "Booking" },
            { value: "booth-experience", label: "Booth experience" },
            { value: "prints-keepsakes", label: "Prints and keepsakes" },
            { value: "event-planning", label: "Event planning" },
          ],
        },
        ORDER_FIELD,
        STATUS_FIELD,
      ]}
    />
  );
}

/* ----------------------------------- Team ------------------------------------ */

export function TeamManager() {
  return (
    <ResourceManager
      title="Team"
      noun="team member"
      intro="People shown on the Our Team page."
      apiUrl="/api/admin/team"
      thumbKey="imageUrl"
      itemTitle={(i) => str(i.name)}
      itemSubtitle={(i) => `${str(i.role)}${i.visible ? "" : " (hidden)"}`}
      defaults={{ visible: true, order: 1 }}
      fields={[
        { key: "name", label: "Name", type: "text", required: true, half: true },
        { key: "role", label: "Role", type: "text", required: true, half: true },
        { key: "biography", label: "Short bio", type: "textarea", rows: 4 },
        { key: "imageUrl", label: "Photo", type: "image", folder: "pages" },
        ORDER_FIELD,
        {
          key: "visible",
          label: "Visible",
          type: "checkbox",
          checkboxLabel: "Show on the website",
          half: true,
        },
      ]}
    />
  );
}

/* -------------------------------- Testimonials ------------------------------- */

export function TestimonialsManager() {
  return (
    <ResourceManager
      title="Testimonials"
      noun="testimonial"
      intro="Customer reviews shown on the website."
      apiUrl="/api/admin/testimonials"
      thumbKey="imageUrl"
      statusKey="status"
      itemTitle={(i) => str(i.reviewerName)}
      itemSubtitle={(i) => str(i.quote)}
      defaults={{ status: "published", eventCategory: "general", rating: 5, order: 1 }}
      fields={[
        { key: "reviewerName", label: "Customer name", type: "text", required: true, half: true },
        {
          key: "rating",
          label: "Rating (1 to 5)",
          type: "number",
          half: true,
        },
        { key: "quote", label: "Review", type: "textarea", required: true, rows: 5 },
        {
          key: "eventCategory",
          label: "Event type",
          type: "select",
          options: EVENT_CATEGORY_OPTIONS,
          half: true,
        },
        { key: "imageUrl", label: "Photo (optional)", type: "image", folder: "pages" },
        ORDER_FIELD,
        STATUS_FIELD,
      ]}
    />
  );
}

/* ---------------------------------- Packages --------------------------------- */

const PACKAGE_FIELDS: Field[] = [
  { key: "name", label: "Package name", type: "text", required: true },
  { key: "shortDescription", label: "Short description", type: "text" },
  {
    key: "tier",
    label: "Package level",
    type: "select",
    half: true,
    options: [
      { value: "standard", label: "Standard" },
      { value: "signature", label: "Signature" },
      { value: "elite", label: "Elite" },
    ],
  },
  { key: "priceCents", label: "Price", type: "money", half: true, required: true },
  {
    key: "durationHours",
    label: "Hours of service",
    type: "number",
    half: true,
    required: true,
  },
  ORDER_FIELD,
  {
    key: "inclusions",
    label: "What is included",
    type: "lines",
    rows: 7,
    help: "Type one item per line.",
  },
  {
    key: "confirmationNotes",
    label: "Notes to confirm with the client",
    type: "textarea",
    rows: 3,
  },
  { key: "active", label: "Active", type: "checkbox", checkboxLabel: "Available for booking", half: true },
  {
    key: "showPricePublicly",
    label: "Show price",
    type: "checkbox",
    checkboxLabel: "Show this price on the website",
    half: true,
  },
];

export function PackagesManager() {
  return (
    <ResourceManager
      title="Packages"
      noun="package"
      intro="Your photo booth packages and prices."
      apiUrl="/api/admin/packages"
      listKey="packages"
      itemTitle={(i) => str(i.name)}
      itemSubtitle={(i) =>
        `$${(Number(i.priceCents ?? 0) / 100).toLocaleString()} · ${str(i.durationHours)} hrs${
          i.active ? "" : " · inactive"
        }`
      }
      defaults={{ tier: "standard", active: true, durationHours: 3, order: 1 }}
      fields={PACKAGE_FIELDS}
      toForm={(item) => ({
        name: str(item.name),
        shortDescription: str(item.shortDescription),
        tier: str(item.tier) || "standard",
        priceCents: String(Number(item.priceCents ?? 0) / 100),
        durationHours: str(item.durationHours),
        order: str(item.order),
        inclusions: Array.isArray(item.inclusions)
          ? (item.inclusions as { label?: string }[]).map((x) => str(x.label))
          : [],
        confirmationNotes: str(item.confirmationNotes),
        active: Boolean(item.active),
        showPricePublicly: Boolean(item.showPricePublicly),
      })}
      toPayload={(v) => {
        const lines = (Array.isArray(v.inclusions) ? v.inclusions : [])
          .map((s) => String(s).trim())
          .filter(Boolean);
        return {
          name: str(v.name).trim(),
          shortDescription: str(v.shortDescription),
          tier: str(v.tier) || "standard",
          priceCents: Math.round(Number(v.priceCents || 0) * 100),
          durationHours: Number(v.durationHours || 1),
          ...(str(v.order) !== "" ? { order: Number(v.order) } : {}),
          inclusions: lines.map((label) => ({ label })),
          confirmationNotes: str(v.confirmationNotes),
          active: Boolean(v.active),
          showPricePublicly: Boolean(v.showPricePublicly),
        };
      }}
    />
  );
}

export function AddOnsManager() {
  return (
    <ResourceManager
      title="Add-ons"
      noun="add-on"
      intro="Extra options clients can add to a package."
      apiUrl="/api/admin/packages"
      listKey="addOns"
      thumbKey="imageUrl"
      itemTitle={(i) => str(i.name)}
      itemSubtitle={(i) =>
        `$${(Number(i.priceCents ?? 0) / 100).toLocaleString()}${i.active ? "" : " · inactive"}`
      }
      defaults={{ active: true, needsClientConfirmation: true, order: 1 }}
      fields={[
        { key: "name", label: "Add-on name", type: "text", required: true },
        { key: "description", label: "Description", type: "textarea", rows: 3 },
        { key: "imageUrl", label: "Add-on photo", type: "image", folder: "products" },
        { key: "priceCents", label: "Price", type: "money", half: true, required: true },
        ORDER_FIELD,
        { key: "active", label: "Active", type: "checkbox", checkboxLabel: "Available for booking", half: true },
        {
          key: "needsClientConfirmation",
          label: "Confirm",
          type: "checkbox",
          checkboxLabel: "Confirm details with the client first",
          half: true,
        },
        {
          key: "showPricePublicly",
          label: "Show price",
          type: "checkbox",
          checkboxLabel: "Show this price on the website",
          half: true,
        },
      ]}
      createBody={(payload) => ({ type: "addon", data: payload })}
      updateBody={(payload) => ({ resource: "addon", data: payload })}
      deleteUrl={(id) => `/api/admin/packages/${id}?resource=addon`}
    />
  );
}

/* ----------------------------------- Brands ---------------------------------- */

export function BrandsManager() {
  return (
    <ResourceManager
      title="Brands we worked with"
      noun="brand"
      intro="Brands and clients we have worked with. Visible brands appear on the Brands page; featured brands also appear on the homepage."
      apiUrl="/api/admin/brands"
      thumbKey="logoUrl"
      itemTitle={(i) => str(i.name)}
      itemSubtitle={(i) =>
        [str(i.industry), str(i.eventType)].filter(Boolean).join(" · ") + (i.visible ? "" : " (hidden)")
      }
      defaults={{ visible: true, featured: false, order: 1 }}
      fields={[
        { key: "name", label: "Brand name", type: "text", required: true, half: true },
        { key: "industry", label: "Industry", type: "text", half: true, placeholder: "Example: Retail, Education" },
        { key: "logoUrl", label: "Brand logo", type: "image", folder: "pages" },
        { key: "eventType", label: "Event or project", type: "text", half: true, placeholder: "Example: Product launch" },
        { key: "location", label: "Location", type: "text", half: true },
        { key: "eventDate", label: "Date or year", type: "text", half: true, placeholder: "Example: June 2025" },
        { key: "websiteUrl", label: "Website link (optional)", type: "text", half: true, placeholder: "https://" },
        {
          key: "description",
          label: "What we did for them",
          type: "textarea",
          rows: 4,
          help: "A short summary of the work, shown on the Brands page.",
        },
        {
          key: "photos",
          label: "Event photos",
          type: "images",
          folder: "pages",
          help: "Photos from the work with this brand. Select several at once.",
        },
        ORDER_FIELD,
        {
          key: "visible",
          label: "Visible",
          type: "checkbox",
          checkboxLabel: "Show on the website",
          half: true,
        },
        {
          key: "featured",
          label: "Featured",
          type: "checkbox",
          checkboxLabel: "Show on the homepage",
          half: true,
        },
      ]}
    />
  );
}
