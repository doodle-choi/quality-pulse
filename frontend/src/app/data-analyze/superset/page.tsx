"use client";

import { ExternalBIContainer } from "@/components/analytics/ExternalBIContainer";

const SUPERSET_FEATURES = [
  {
    icon: "explore",
    title: "Advanced Exploration",
    description: "Slice and dice datasets with 40+ visualization types, from heatmaps to geospatial charts.",
  },
  {
    icon: "code",
    title: "SQL Lab",
    description: "A full-featured SQL IDE for writing, running, and visualizing complex queries directly in the browser.",
  },
  {
    icon: "speed",
    title: "High Performance",
    description: "Enterprise-grade engine with async query execution, caching layers, and support for petabyte-scale datasets.",
  },
];

export default function SupersetPage() {
  return (
    <ExternalBIContainer
      toolName="Apache Superset"
      toolDescription="A modern, enterprise-ready data exploration and visualization platform. Apache Superset is fast, lightweight, and designed for users of all skill levels to explore and visualize data at any scale."
      toolIcon="rocket_launch"
      features={SUPERSET_FEATURES}
      accentColorClass="text-[#20A7C9]"
      isServiceReady={false}
    />
  );
}
