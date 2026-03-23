"use client";

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

interface TimelinePoint {
  date: string;
  count: number;
}

export function TimelineChart({ data }: { data: TimelinePoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[180px] flex items-center justify-center text-text-secondary text-sm italic">
        분석 중...
      </div>
    );
  }

  return (
    <div className="w-full h-[180px] pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
              boxShadow: "var(--shadow-md)",
              color: "var(--text)"
            }}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="var(--primary)" 
            strokeWidth={3} 
            dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
