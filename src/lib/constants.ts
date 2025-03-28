import { FileEdit, FileText, LayoutDashboard, Settings } from "lucide-react";
import { TabType } from "./types";

export const REVALIDATION_TIME = 60 * 60 * 24;

export const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    id: "dashboard" as TabType,
  },
  {
    name: "Posts",
    icon: FileText,
    id: "posts" as TabType,
  },
  {
    name: "Drafts",
    icon: FileEdit,
    id: "drafts" as TabType,
  },
  {
    name: "Settings",
    icon: Settings,
    id: "settings" as TabType,
  },
];

export const HEADER_TITLE = "Inscribe.so";
export const GENERAL_BIO = "Blogger";
export const MAIN_DOMAIN = "inscribe.so";
export const BASE_URL = "https://inscribe.so";

export const SOCIAL_PLATFORMS = [
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
];
