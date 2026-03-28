"use client";

import { Search, Filter, X } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedRegion: string;
  setSelectedRegion: (val: string) => void;
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedSeverity: string;
  setSelectedSeverity: (val: string) => void;
  regions: string[];
  brands: string[];
  categories: string[];
  severities: string[];
  sortBy: string;
  setSortBy: (val: string) => void;
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  selectedSeverity,
  setSelectedSeverity,
  regions,
  brands,
  categories,
  severities,
  sortBy,
  setSortBy,
}: FilterBarProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative w-full lg:w-1/3 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search issues, recalls, lawsuits..."
            className="w-full bg-surface-alt border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              aria-label="Clear search query"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:flex-1 lg:justify-end">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-text-muted" />
            <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Filters:</span>
          </div>

          <select
            className="bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary focus:outline-none focus:border-primary cursor-pointer hover:border-text-muted transition-colors"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select
            className="bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary focus:outline-none focus:border-primary cursor-pointer hover:border-text-muted transition-colors"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select
            className="bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary focus:outline-none focus:border-primary cursor-pointer hover:border-text-muted transition-colors"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            className="bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary focus:outline-none focus:border-primary cursor-pointer hover:border-text-muted transition-colors"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
          >
            <option value="">All Severities</option>
            {severities.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="w-px h-6 bg-border mx-1" />

          <select
            className="bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-primary focus:outline-none focus:border-primary cursor-pointer hover:border-primary/50 transition-colors"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest Discovery</option>
            <option value="published">Published Date</option>
            <option value="oldest">Oldest First</option>
          </select>
          
          {(selectedRegion || selectedBrand || selectedCategory || selectedSeverity || searchQuery) && (
            <button 
              onClick={() => {
                setSelectedRegion("");
                setSelectedBrand("");
                setSelectedCategory("");
                setSelectedSeverity("");
                setSearchQuery("");
              }}
              className="text-[11px] font-bold text-red-500 hover:text-red-600 px-2 py-1 flex items-center gap-1"
            >
              <X size={12} /> CLEAR ALL
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
