export interface MapDataPoint {
  id: string;
  name: string;
  value: number;
  unit: string;
  coordinates: [number, number];
  status: "normal" | "warning" | "critical";
}
