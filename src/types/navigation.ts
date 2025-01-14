import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  className?: string;
  showWhen?: (status: any) => boolean;
}