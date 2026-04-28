import { LayoutDashboard, Users, CalendarDays, Trophy, FileText, UserPlus, Mail, ClipboardList, Settings, Newspaper, Award, Layout, Rss, MessageSquareQuote, Globe, Crown } from 'lucide-react';

export const ADMIN_NAV_LINKS = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
    submenus: [
      { name: "Register New User", href: "/admin/register" },
      { name: "Manage Users", href: "/admin/users/manage" },
    ]
  },
  {
    name: "Competitions",
    href: "/admin/competitions",
    icon: Trophy,
    submenus: [
      { name: "Add New Competition", href: "/admin/competitions/add" },
      { name: "Manage Competitions", href: "/admin/competitions/manage" },
    ]
  },
  {
    name: "Upcoming Events",
    href: "/admin/events/upcoming",
    icon: CalendarDays,
    submenus: [
      { name: "Add New Event", href: "/admin/events/upcoming/add" },
      { name: "Manage Events", href: "/admin/events/upcoming/manage" },
      { name: "Event Registrations", href: "/admin/events/registrations" },
    ]
  },
  {
    name: "Past Results & Records",
    href: "/admin/events/past-results-records",
    icon: FileText,
    submenus: [
      { name: "Add New Result", href: "/admin/events/past-results-records/add" },
      { name: "Manage Results", href: "/admin/events/past-results-records/manage" },
    ]
  },
  {
    name: "National Records",
    href: "/admin/records",
    icon: Award,
    submenus: [
      { name: "Add New Record", href: "/admin/records/add" },
      { name: "Manage Records", href: "/admin/records/manage" },
    ]
  },
  {
    name: "Latest News",
    href: "/admin/latest-news",
    icon: Rss,
    submenus: [
      { name: "Add News Item", href: "/admin/latest-news/add" },
      { name: "Manage News", href: "/admin/latest-news/manage" },
    ]
  },
  {
    name: "Press Release",
    href: "/admin/press-releases",
    icon: Newspaper,
    submenus: [
      { name: "Add New Release", href: "/admin/press-releases/add" },
      { name: "Manage Releases", href: "/admin/press-releases/manage" },
    ]
  },
  {
    name: "Membership Plans",
    href: "/admin/membership-plans",
    icon: UserPlus,
    submenus: [
      { name: "Add New Plan", href: "/admin/membership-plans/add" },
      { name: "Manage Plans", href: "/admin/membership-plans/manage" },
    ]
  },
  {
    name: "Achievements",
    href: "/admin/achievements",
    icon: Globe,
    submenus: [
      { name: "Add Achievement", href: "/admin/achievements/add" },
      { name: "Manage Achievements", href: "/admin/achievements/manage" },
    ]
  },
  {
    name: "Contributors",
    href: "/admin/contributors",
    icon: Crown,
    submenus: [
      { name: "Add Contributor", href: "/admin/contributors/add" },
      { name: "Manage Contributors", href: "/admin/contributors/manage" },
    ]
  },
  {
    name: "Senior Members",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
    submenus: [
      { name: "Add Member", href: "/admin/testimonials/add" },
      { name: "Manage Members", href: "/admin/testimonials/manage" },
    ]
  },
  {
    name: "Contact Submissions",
    href: "/admin/contact-submissions",
    icon: Mail,
  },
  {
    name: "Membership Applications",
    href: "/admin/membership-applications",
    icon: ClipboardList,
  },
  {
    name: "Site Content",
    href: "/admin/content",
    icon: Layout,
  },
  {
    name: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];