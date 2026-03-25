import {
  BarChart3,
  Activity,
  Database,
  Cpu,
  CreditCard,
  LayoutDashboard,
  RefreshCw,
  LucideIcon
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_ITEMS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Intelligence Feed", href: "/", icon: Activity, badge: "Live" },
      { name: "Risk Analytics", href: "#", icon: BarChart3 },
    ]
  },
  {
    label: "Pipelines",
    items: [
      { name: "Source Monitor", href: "#", icon: Database },
      { name: "Triage Agent", href: "#", icon: Cpu },
      { name: "LLM Cost", href: "#", icon: CreditCard },
    ]
  },
  {
    label: "Admin",
    items: [
      { name: "Raw DB View", href: "/admin/raw", icon: Database },
      { name: "Crawler Logs", href: "/admin/logs", icon: Activity },
      { name: "Scheduler / Sync", href: "/admin/scheduler", icon: RefreshCw },
    ]
  }
];
