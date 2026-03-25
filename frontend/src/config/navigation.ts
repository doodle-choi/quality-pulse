import {
  BarChart3,
  Settings,
  Activity,
  Database,
  Cpu,
  CreditCard,
  ShieldCheck,
  LayoutDashboard,
  RefreshCw,
  LucideIcon
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
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
      { name: "Intelligence Feed", href: "#", icon: Activity },
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
    label: "Security",
    items: [
      { name: "Brand Safety", href: "#", icon: ShieldCheck },
      { name: "API Keys", href: "#", icon: Settings },
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
