export interface NavItem {
  name: string;
  href: string;
  icon: string; // Material Symbols icon name
  badge?: string;
  subItems?: { name: string; href: string }[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_ITEMS: NavGroup[] = [
  {
    label: "Dashboard",
    items: [
      { 
        name: "Quality Operations", 
        href: "/", 
        icon: "dashboard",
        subItems: [
          { name: "Service Material Status", href: "/dashboard/materials" },
          { name: "Quality Indicator Status", href: "/dashboard/quality" },
        ]
      },
      { 
        name: "Business Strategy", 
        href: "/strategy/performance", 
        icon: "insights",
        subItems: [
          { name: "Action Item Progress", href: "/strategy/action-items" },
          { name: "Execution Details", href: "/strategy/details" },
        ]
      },
    ]
  },
  {
    label: "Data Analyze",
    items: [
      { name: "Visual Lab", href: "/data-analyze/visual", icon: "monitoring" },
      { name: "Metabase", href: "/data-analyze/metabase", icon: "analytics" },
      { name: "Superset", href: "/data-analyze/superset", icon: "rocket_launch" },
      { name: "Data Hub", href: "/data-analyze/hub", icon: "hub" },
      { name: "AI Risk Forecast", href: "/data-analyze/forecast", icon: "auto_graph" },
    ]
  },
  {
    label: "World Issues",
    items: [
      { name: "Global Feed", href: "/world-issues/feed", icon: "rss_feed", badge: "Live" },
      { name: "Scraper Hub", href: "/world-issues/scrapers", icon: "lan" },
      { name: "Sentiment Map", icon: "public", href: "/world-issues/sentiment" },
    ]
  },
  {
    label: "Admin",
    items: [
      { name: "Source Monitor", href: "/admin/sources", icon: "database" },
      { name: "Triage Agent", href: "/admin/triage", icon: "troubleshoot" },
      { name: "Crawler Logs", href: "/admin/logs", icon: "description" },
      { name: "Scheduler / Sync", href: "/admin/scheduler", icon: "sync" },
      { name: "Announcements", href: "/admin/announcements", icon: "campaign" },
    ]
  }
];
