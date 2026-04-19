"use client";

import { useState, useMemo } from "react";
import { IssueFeed } from "@/components/dashboard/IssueFeed";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { IssueAttr } from "@/components/dashboard/IssueCard";
import { WorldMap } from "@/components/dashboard/WorldMap";
import { ComponentMatrix } from "@/components/dashboard/ComponentMatrix";
import { AutoRefresh } from "@/components/AutoRefresh";

export function InsightBoardContainer({ initialIssues }: { initialIssues: IssueAttr[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Filter options extraction
  const regions = useMemo(() => Array.from(new Set(initialIssues.map(i => i.region || "Global"))).sort(), [initialIssues]);
  const brands = useMemo(() => Array.from(new Set(initialIssues.map(i => i.brand))).sort(), [initialIssues]);
  const categories = useMemo(() => Array.from(new Set(initialIssues.map(i => i.product_category))).sort(), [initialIssues]);
  const severities = ["Critical", "High", "Medium", "Low"];

  // Filtering and sorting logic
  const filteredIssues = useMemo(() => {
    const filtered = initialIssues.filter(issue => {
      const matchesSearch = 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === "" || (issue.region || "Global") === selectedRegion;
      const matchesBrand = selectedBrand === "" || issue.brand === selectedBrand;
      const matchesCategory = selectedCategory === "" || issue.product_category === selectedCategory;
      const matchesSeverity = selectedSeverity === "" || issue.severity === selectedSeverity;
      const matchesComponent = selectedComponent === "" || issue.failed_component === selectedComponent;

      return matchesSearch && matchesRegion && matchesBrand && matchesCategory && matchesSeverity && matchesComponent;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "published") {
        const dateA = new Date(a.published_at || a.created_at).getTime();
        const dateB = new Date(b.published_at || b.created_at).getTime();
        return dateB - dateA;
      }
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [initialIssues, searchQuery, selectedRegion, selectedBrand, selectedCategory, selectedSeverity, selectedComponent, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      <AutoRefresh interval={15000} />
      
      {/* 1. Spatial Intelligence & Component Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <WorldMap 
          issues={initialIssues} 
          selectedRegion={selectedRegion}
          onRegionClick={setSelectedRegion} 
        />
        <ComponentMatrix 
          issues={initialIssues}
          selectedComponent={selectedComponent}
          onComponentClick={setSelectedComponent}
        />
      </div>

      {/* 2. Advanced Filtering */}
      <FilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        regions={regions}
        brands={brands}
        categories={categories}
        severities={severities}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* 3. Detailed Engineering Feed */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text font-headline">Technical Insight Feed</h2>
          <span className="text-xs font-medium text-text-muted bg-surface-alt px-2.5 py-1 rounded-md border border-border">
            {filteredIssues.length} detailed matches
          </span>
        </div>
        <IssueFeed issues={filteredIssues} />
      </div>
    </div>
  );
}
