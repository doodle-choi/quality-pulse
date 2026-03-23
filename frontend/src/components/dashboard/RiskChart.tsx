"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface RiskData {
  name: string;
  value: number;
  color: string;
}

export function RiskChart({ data }: { data: RiskData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[220px] flex items-center justify-center text-text-secondary text-sm italic">
        데이터 요약 중...
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[220px] flex items-center justify-center pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
            ))}
          </Pie>
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
              boxShadow: "var(--shadow-md)",
              color: "var(--text)"
            }}
            itemStyle={{ color: "var(--text)", fontWeight: 600 }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "11px", outline: 'none', paddingTop: "10px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
