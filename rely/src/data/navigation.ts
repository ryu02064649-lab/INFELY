import { REQUEST_PATH } from "@/config/site";

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "CONCEPT", href: "/#concept" },
  { label: "SERVICE", href: "/#service" },
  { label: "HOW IT WORKS", href: "/#how-it-works" },
  { label: "PRICE", href: "/#price" },
];

export const requestNav: NavItem = { label: "REQUEST", href: REQUEST_PATH };

export const footerNav: NavItem[] = [
  { label: "SERVICE", href: "/#service" },
  { label: "CONCEPT", href: "/#concept" },
  { label: "PRICE", href: "/#price" },
  { label: "REQUEST", href: REQUEST_PATH },
];
