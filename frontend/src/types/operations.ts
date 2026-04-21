import { MapDataPoint } from "./dashboard";

export interface OperationEvent {
  id: string;
  timestamp: string;
  entityId: string;
  entityName: string;
  category: "Warehouse" | "Inventory" | "Logistics";
  action: "Inbound" | "Outbound" | "Transfer" | "Audit" | "Alert" | "System Check";
  detail: string;
  value: string;
  status: "normal" | "warning" | "critical";
}

export interface OperationThemeData {
  summary: MapDataPoint[];
  events: OperationEvent[];
}
