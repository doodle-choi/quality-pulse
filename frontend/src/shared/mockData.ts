// === Timeline (7-Day Volume Trend) ===
export const MOCK_TIMELINE_DATA = [
  { date: "03-24", count: 12 },
  { date: "03-25", count: 19 },
  { date: "03-26", count: 15 },
  { date: "03-27", count: 42 }, // Anomaly spike
  { date: "03-28", count: 22 },
  { date: "03-29", count: 18 },
  { date: "03-30", count: 24 },
];

// === Risk Distribution (Donut) ===
export const MOCK_RISK_DATA = [
  { name: "Critical Hazards", value: 45 },
  { name: "High Risks", value: 120 },
  { name: "Medium Quality", value: 340 },
  { name: "Low/Monitoring", value: 890 },
];

// === KPI Stats (Stitch Bento Grid) ===
export const MOCK_KPI_STATS = [
  {
    label: "Current Progress",
    value: "842.50",
    unit: "K",
    change: "+12.4%",
    changeType: "positive" as const,
    icon: "trending_up",
    progress: 72, // percent
  },
  {
    label: "Target vs Achievement",
    value: "92.4",
    unit: "%",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: "track_changes",
    progress: 75,
  },
  {
    label: "Projected Estimate",
    value: "1.28",
    unit: "M",
    change: "PROJECTED",
    changeType: "neutral" as const,
    icon: "insights",
    note: "Expected completion within 14 business days.",
  },
];

// === Regional Distribution (Horizontal Bar) ===
export const MOCK_REGIONAL_DATA = [
  { region: "NA", percentage: 85 },
  { region: "EMEA", percentage: 62 },
  { region: "APAC", percentage: 44 },
];

// === Recent Architectural Events (Activity List) ===
export const MOCK_EVENTS = [
  {
    title: "Sync Pipeline Alpha",
    subtitle: "Completed 12 minutes ago",
    icon: "sync",
    status: "OPTIMIZED",
    statusType: "success" as const,
  },
  {
    title: "Latency Peak - Node 04",
    subtitle: "Occurred 45 minutes ago",
    icon: "warning",
    status: "CRITICAL",
    statusType: "error" as const,
  },
  {
    title: "Master Data Indexing",
    subtitle: "Ongoing process",
    icon: "database",
    status: "PENDING",
    statusType: "neutral" as const,
  },
];
