"use client";

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { ChartMockResponse } from '@/shared/mockDataQuality';
import { useTheme } from 'next-themes';

interface Props {
  data: ChartMockResponse;
}

export function QualityIndicatorChart({ data }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const option = useMemo(() => {
    // Generate X Axis categories (dates) from the first series
    // ECharts requires identical X Axis for multi-series line chart stacking/overlays.
    // Instead of raw dates, we'll use Index or normalized labels (e.g., W01, W02, Jan, Feb) 
    // so Year 2024 maps over Year 2025.
    
    // Extract nominal labels regardless of year (e.g. "2024-W01" -> "W01")
    const xLabels = data.series[0]?.data.map(d => {
      if (d.date.includes('-')) return d.date.split('-')[1]; // Gets Month or Week index
      return d.date; // fallback
    }) || [];

    const colors = [
      isDark ? '#00e5ff' : '#00b4d8', // Cyan (Current/Primary)
      isDark ? '#b088ff' : '#7209b7', // Purple (Previous)
      isDark ? '#ff006e' : '#d90429', // Red
    ];

    const targetLines = data.targets.map((t, idx) => ({
      yAxis: t.value,
      name: `${t.year} Target`,
      lineStyle: {
        color: colors[idx % colors.length],
        type: 'dashed' as const,
        width: 1.5,
        opacity: 0.6
      },
      label: {
        formatter: `${t.year} Target: {c}`,
        position: 'insideEndTop',
        color: isDark ? '#a1a1aa' : '#52525b'
      }
    }));

    const echartsSeries = data.series.map((yearData, index) => {
      // Split actual vs projected
      const actualData = yearData.data.map(d => d.isProjected ? null : d.value);
      // To connect the line smoothly, we push the last actual value to projected as its start.
      const projectedData: (number | null)[] = [];
      let lastActual: number | null = null;
      
      yearData.data.forEach(d => {
          if (!d.isProjected) {
              projectedData.push(null);
              lastActual = d.value;
          } else {
              if (lastActual !== null && projectedData.length > 0) {
                  projectedData[projectedData.length - 1] = lastActual;
                  lastActual = null; // connect once
              }
              projectedData.push(d.value);
          }
      });

      return [
        {
          name: `${yearData.year} Actual`,
          type: 'line',
          data: actualData,
          showSymbol: false,
          smooth: true,
          lineStyle: { width: 3, color: colors[index % colors.length] },
          itemStyle: { color: colors[index % colors.length] },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: colors[index % colors.length] + (isDark ? '40' : '30') },
                { offset: 1, color: colors[index % colors.length] + '00' }
              ]
            }
          },
          markLine: index === 0 ? {
            symbol: ['none', 'none'],
            data: targetLines
          } : undefined
        },
        {
          name: `${yearData.year} Projected`,
          type: 'line',
          data: projectedData,
          showSymbol: false,
          smooth: true,
          lineStyle: { width: 3, color: colors[index % colors.length], type: 'dotted' },
          itemStyle: { color: colors[index % colors.length] },
        }
      ];
    }).flat();

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#18181b' : '#ffffff',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        textStyle: { color: isDark ? '#e4e4e7' : '#18181b' },
      },
      legend: {
        top: 0,
        textStyle: { color: isDark ? '#a1a1aa' : '#52525b' }
      },
      grid: {
        top: 60,
        left: '2%',
        right: '5%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xLabels,
        axisLine: { lineStyle: { color: isDark ? '#3f3f46' : '#d4d4d8' } },
        axisLabel: { color: isDark ? '#a1a1aa' : '#52525b' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: isDark ? '#27272a' : '#f4f4f5', type: 'dashed' } },
        axisLabel: { color: isDark ? '#a1a1aa' : '#52525b' }
      },
      series: echartsSeries
    };
  }, [data, isDark]);

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />;
}
