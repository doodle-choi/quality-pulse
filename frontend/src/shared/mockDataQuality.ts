// Mock data generator for Quality Indicator Status (Dynamic Scaling YoY)

export type Granularity = 'week' | 'month' | 'year';
export type MetricType = 'total_issues' | 'defect_rate' | 'resolution_time';
export interface TargetEntry { year: number; value: number }

export interface TimeSeriesPoint {
  date: string;       // e.g. "2024-01", "2024-W01"
  value: number;      // Mapped to Y-axis
  isProjected?: boolean; 
}

export interface YearDataSet {
  year: number;
  data: TimeSeriesPoint[];
}

export interface ChartMockResponse {
  metric: MetricType;
  granularity: Granularity;
  region: string;
  targets: TargetEntry[];
  series: YearDataSet[];
}

/**
 * Mocks the backend grouping via date_trunc
 */
export function fetchMockQualityData(
  years: number[], 
  metric: MetricType, 
  granularity: Granularity, 
  region: string
): ChartMockResponse {
  
  const series: YearDataSet[] = [];
  const targets: TargetEntry[] = [];
  
  years.forEach(year => {
    // Generate Target
    let baseTarget = 0;
    if (metric === 'total_issues') baseTarget = 150000;
    if (metric === 'defect_rate') baseTarget = 3.5; // percent
    if (metric === 'resolution_time') baseTarget = 24.5; // hours

    // Slight reduction per year simulating improvement targets
    targets.push({ year, value: baseTarget * (1 - (year - 2024) * 0.05) });

    // Generate Points
    const data: TimeSeriesPoint[] = [];
    const elements = granularity === 'month' ? 12 : granularity === 'week' ? 52 : 1;
    
    // Determine if this is the "current" year for projection
    const isCurrentYear = year === new Date().getFullYear();
    const currentElementBoundary = isCurrentYear ? (granularity === 'month' ? new Date().getMonth() + 1 : 15) : 999;

    for (let i = 1; i <= elements; i++) {
        const valBase = baseTarget * (granularity === 'month' ? 0.08 : granularity === 'week' ? 0.02 : 1);
        
        // Add random seasonality and noise
        const seasonality = Math.sin((i / elements) * Math.PI) * (valBase * 0.3);
        const noise = (Math.random() - 0.5) * (valBase * 0.15);
        let finalVal = valBase + seasonality + noise;

        // Force YoY slight improvements normally
        finalVal = finalVal * (1 - (year - 2024) * 0.03); 

        const isProjected = isCurrentYear && i > currentElementBoundary;
        
        // If projected, make it follow target linearly
        if (isProjected) {
             const targetMonthly = baseTarget * (granularity === 'month' ? 0.08 : granularity === 'week' ? 0.02 : 1);
             finalVal = targetMonthly + (Math.random() - 0.5) * (valBase * 0.05); // low variance
        }

        const dateStr = granularity === 'month' 
            ? `${year}-${i.toString().padStart(2, '0')}`
            : granularity === 'week'
              ? `${year}-W${i.toString().padStart(2, '0')}`
              : `${year}`;

        data.push({
            date: dateStr,
            value: Number(Math.max(0, finalVal).toFixed(2)),
            isProjected
        });
    }

    series.push({ year, data });
  });

  return {
    metric,
    granularity,
    region,
    targets,
    series
  };
}
