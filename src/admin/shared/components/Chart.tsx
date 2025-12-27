/**
 * ADMIN CHART COMPONENT
 * SPARKGEAR Design Language
 * Simple chart implementations without external library
 */

import React from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  label: string;
  value: number;
}

// Bar Chart
interface BarChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  color = '#16A34A',
  height = 200,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-[1.5rem] border border-shop-border p-6 shadow-subtle">
      {title && (
        <h3 className="text-sm font-black text-shop-primary uppercase tracking-tight mb-6">
          {title}
        </h3>
      )}
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((point, index) => {
          const percentage = (point.value / maxValue) * 100;
          return (
            <div
              key={point.label}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${percentage}%` }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="w-full rounded-t-lg"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] font-bold text-shop-muted text-center">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Line Chart (Simple)
interface LineChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
  height?: number;
  showValues?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  color = '#16A34A',
  height = 200,
  showValues = true,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return { x, y, ...point };
  });

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaData = `${pathData} L 100 100 L 0 100 Z`;

  return (
    <div className="bg-white rounded-[1.5rem] border border-shop-border p-6 shadow-subtle">
      {title && (
        <h3 className="text-sm font-black text-shop-primary uppercase tracking-tight mb-6">
          {title}
        </h3>
      )}
      <div style={{ height }} className="relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Gradient fill */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Area */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            d={areaData}
            fill="url(#chartGradient)"
          />
          
          {/* Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Points */}
          {points.map((point, index) => (
            <motion.circle
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 + 0.5 }}
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill={color}
            />
          ))}
        </svg>
        
        {/* Labels */}
        <div className="flex justify-between mt-4">
          {data.map((point, index) => (
            <div key={index} className="text-center">
              {showValues && (
                <div className="text-xs font-mono font-bold text-shop-primary mb-1">
                  {point.value.toLocaleString()}
                </div>
              )}
              <div className="text-[10px] font-bold text-shop-muted">
                {point.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Donut Chart
interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  size = 180,
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -90;

  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = ((startAngle + angle) * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...item,
      percentage,
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div className="bg-white rounded-[1.5rem] border border-shop-border p-6 shadow-subtle">
      {title && (
        <h3 className="text-sm font-black text-shop-primary uppercase tracking-tight mb-6">
          {title}
        </h3>
      )}
      <div className="flex items-center gap-6">
        <div style={{ width: size, height: size }} className="relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((segment, index) => (
              <motion.path
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                d={segment.path}
                fill={segment.color}
                style={{ transformOrigin: '50% 50%' }}
              />
            ))}
            {/* Inner circle (donut hole) */}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-black text-shop-primary">
                {total.toLocaleString()}
              </div>
              <div className="text-[10px] font-bold text-shop-muted uppercase">
                סה״כ
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex-1 space-y-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-shop-primary truncate">
                  {segment.label}
                </div>
                <div className="text-xs text-shop-muted">
                  {segment.value.toLocaleString()} ({segment.percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default { BarChart, LineChart, DonutChart };

