export type ExperienceGalleryShot = {
  imageUrl: string;
  alt: string;
  caption?: string;
};

/** Guest moments for the Experiences (/services) page — no duplicate shots. */
export const experienceGalleryShots: ExperienceGalleryShot[] = [
  {
    imageUrl: "/gallery/experience/experience-01-birthday-group.jpg",
    alt: "Guests celebrating a 60th birthday at the photo booth",
    caption: "Milestone celebrations",
  },
  {
    imageUrl: "/gallery/experience/experience-03-family.jpg",
    alt: "Family posing together at a magenta-lit booth backdrop",
    caption: "Family moments",
  },
  {
    imageUrl: "/gallery/experience/experience-04-celebration.jpg",
    alt: "Two guests smiling at a celebration photo booth",
    caption: "On the dance floor",
  },
  {
    imageUrl: "/gallery/experience/experience-06-props-fun.jpg",
    alt: "Guests laughing with oversized photo booth props",
    caption: "Props & personality",
  },
  {
    imageUrl: "/gallery/experience/experience-07-angela-shannon.jpg",
    alt: "Wedding guests with Congrats and Happily Ever After props",
    caption: "Wedding celebrations",
  },
  {
    imageUrl: "/gallery/experience/experience-09-wedding-family.jpg",
    alt: "Wedding family portrait with playful booth props",
    caption: "Weddings & families",
  },
  {
    imageUrl: "/gallery/experience/experience-10-wedding-props.jpg",
    alt: "Multi-generational wedding guests with booth props",
    caption: "Guests of every age",
  },
];
