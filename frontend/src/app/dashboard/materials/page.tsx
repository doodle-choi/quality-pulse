"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { LabeledWorldMap } from "@/components/dashboard/LabeledWorldMap";
import { RawDataTable } from "@/components/dashboard/RawDataTable";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { MapDataPoint } from "@/types/dashboard";
import { OperationEvent } from "@/types/operations";

export default function MaterialsPage() {
  const { t } = useTranslation();

  // Subsidiary Coordinates Mapping
  const SUBSIDIARIES: { id: string; name: string; coordinates: [number, number] }[] = [
    { id: "sek", name: "SEK (Korea)", coordinates: [127.7, 37.5] },
    { id: "sea", name: "SEA (North America)", coordinates: [-95.7, 37.0] },
    { id: "seg", name: "SEG (Europe)", coordinates: [10.4, 51.1] },
    { id: "sesl", name: "SESL (SE Asia)", coordinates: [103.8, 1.3] },
    { id: "seda", name: "SEDA (LATAM)", coordinates: [-47.9, -15.8] },
    { id: "scic", name: "SCIC (China)", coordinates: [116.4, 39.9] },
    { id: "sei", name: "SEI (India)", coordinates: [77.2, 28.6] },
  ];

  // Helper to generate mock events
  const generateMockEvents = (category: OperationEvent["category"], count: number): OperationEvent[] => {
    const actions: OperationEvent["action"][] = ["Inbound", "Outbound", "Transfer", "Audit", "Alert", "System Check"];
    const statuses: OperationEvent["status"][] = ["normal", "warning", "critical"];
    
    return Array.from({ length: count }).map((_, i) => {
      const sub = SUBSIDIARIES[Math.floor(Math.random() * SUBSIDIARIES.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const status = Math.random() > 0.8 ? (Math.random() > 0.5 ? "critical" : "warning") : "normal";
      
      const valuePrefix = category === "Warehouse" ? "" : category === "Inventory" ? "" : "";
      const valueSuffix = category === "Warehouse" ? "%" : category === "Inventory" ? "K" : "pts";
      const valueNum = Math.floor(Math.random() * 100);

      return {
        id: `${category.toLowerCase()}-${i}`,
        timestamp: `2024-04-21 ${21 - Math.floor(i/2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        entityId: sub.id,
        entityName: sub.name,
        category,
        action,
        detail: `${action} operation completed successfully at ${sub.id.toUpperCase()} site.`,
        value: `${valueNum}${valueSuffix}`,
        status
      };
    });
  };

  // 1. Warehouse Capacity Data
  const capacityData: MapDataPoint[] = SUBSIDIARIES.map((s, i) => ({
    ...s,
    value: [88, 72, 95, 64, 45, 91, 56][i],
    unit: "%",
    status: [88, 72, 95, 64, 45, 91, 56][i] > 90 ? "critical" : [88, 72, 95, 64, 45, 91, 56][i] > 80 ? "warning" : "normal"
  }));
  const capacityEvents = generateMockEvents("Warehouse", 15);

  // 2. Inventory Level Data
  const inventoryData: MapDataPoint[] = SUBSIDIARIES.map((s, i) => ({
    ...s,
    value: [450, 120, 890, 310, 150, 670, 420][i],
    unit: "K",
    status: [450, 120, 890, 310, 150, 670, 420][i] > 800 ? "critical" : [450, 120, 890, 310, 150, 670, 420][i] > 500 ? "warning" : "normal"
  }));
  const inventoryEvents = generateMockEvents("Inventory", 15);

  // 3. Logistics Liquidity Data
  const liquidityData: MapDataPoint[] = SUBSIDIARIES.map((s, i) => ({
    ...s,
    value: [94, 85, 42, 77, 91, 38, 82][i],
    unit: "pts",
    status: [94, 85, 42, 77, 91, 38, 82][i] < 50 ? "critical" : [94, 85, 42, 77, 91, 38, 82][i] < 70 ? "warning" : "normal"
  }));
  const liquidityEvents = generateMockEvents("Logistics", 15);

  return (
    <div className="flex flex-col gap-12 p-2 mb-12 animate-in fade-in duration-1000">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-text-muted">
          <MaterialIcon name="inventory_2" size="sm" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70">Subsidiary Operation Board</span>
        </div>
        <h1 className="text-2xl font-headline font-extrabold text-text tracking-tight">
          {t("navigation.Service Material Status", "Service Material Status")}
        </h1>
      </header>

      {/* Operation Row 1: Warehouse Capacity */}
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[500px]">
          <div className="lg:col-span-3 h-full min-h-0">
            <LabeledWorldMap 
              data={capacityData} 
              title="Global Warehouse Capacity" 
              mainColor="#3b82f6" 
            />
          </div>
          <div className="lg:col-span-2 h-full min-h-0">
            <RawDataTable 
              events={capacityEvents} 
              title="Capacity" 
            />
          </div>
        </div>
      </section>

      {/* Operation Row 2: Inventory Level */}
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[500px]">
          <div className="lg:col-span-3 h-full min-h-0">
            <LabeledWorldMap 
              data={inventoryData} 
              title="Regional Parts Inventory Level" 
              mainColor="#10b981" 
            />
          </div>
          <div className="lg:col-span-2 h-full min-h-0">
            <RawDataTable 
              events={inventoryEvents} 
              title="Inventory" 
            />
          </div>
        </div>
      </section>

      {/* Operation Row 3: Logistics Liquidity */}
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[500px]">
          <div className="lg:col-span-3 h-full min-h-0">
            <LabeledWorldMap 
              data={liquidityData} 
              title="Logistics Hub Liquidity" 
              mainColor="#f59e0b" 
            />
          </div>
          <div className="lg:col-span-2 h-full min-h-0">
            <RawDataTable 
              events={liquidityEvents} 
              title="Liquidity" 
            />
          </div>
        </div>
      </section>
    </div>
  );
}
