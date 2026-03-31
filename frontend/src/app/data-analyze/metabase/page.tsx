"use client";

import { ExternalBIContainer } from "@/components/analytics/ExternalBIContainer";

const METABASE_FEATURES = [
  {
    icon: "search",
    title: "Visual Query Builder",
    description: "Build complex queries without writing SQL using an intuitive drag-and-drop interface.",
  },
  {
    icon: "dashboard_customize",
    title: "Interactive Dashboards",
    description: "Create shareable dashboards with filters, drill-downs, and real-time data refresh.",
  },
  {
    icon: "group",
    title: "Team Collaboration",
    description: "Share insights across teams with granular access controls and embedded analytics.",
  },
];

export default function MetabasePage() {
  return (
    <ExternalBIContainer
      toolName="Metabase"
      toolDescription="Open-source business intelligence platform that enables your team to ask questions about data and visualize answers in formats that make sense — without requiring deep SQL knowledge."
      toolIcon="analytics"
      features={METABASE_FEATURES}
      accentColorClass="text-[#509EE3]"
      isServiceReady={false}
    />
  );
}
