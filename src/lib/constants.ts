export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Who We Are", href: "/who-we-are" },
  { name: "Gallery", href: "/gallery" },
  {
    name: "Events",
    href: "/events",
    submenus: [
      { name: "Upcoming Events", href: "/events/upcoming" },
      { name: "Past Results & Records", href: "/events/past-results-records" },
    ],
  },
  {
    name: "Records",
    href: "/records",
    submenus: [], // Will be populated dynamically from the database
  },
  {
    name: "Press Release",
    href: "/press-release",
    submenus: [], // Will be populated dynamically from the database
  },
  { name: "Constitution", href: "/constitution" },
  { name: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = [
  {
    title: "About PLRA",
    links: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/who-we-are" },
      { name: "Gallery", href: "/gallery" },
      { name: "Upcoming Events", href: "/events/upcoming" },
      { name: "Past Competition Scores & National Records", href: "/events/past-results-records" },
      { name: "History", href: "/history" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Training & Education", href: "/training-education" },
      { name: "Rules & Regulations", href: "/rules-regulations" },
      { name: "Press Release", href: "/press-release" },
      { name: "Blogs/ News", href: "/blogs-news" },
      { name: "Membership", href: "/membership" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
];

export const LATEST_NEWS_ITEMS = [
  "The 3rd F-Class National Long Range Shooting Championship 2025 will be held from 30th October to 3rd November!",
  "New membership applications are now open for 2025!",
  "Upcoming training session for beginners on 15th December.",
];