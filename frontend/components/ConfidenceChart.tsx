"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList 
} from "recharts";
import { ClassScore } from "@/types/prediction";
import { motion } from "framer-motion";

interface ConfidenceChartProps {
  data: ClassScore[];
}

export default function ConfidenceChart({ data }: ConfidenceChartProps) {
  // Sort data for better visualization
  const sortedData = [...data].sort((a, b) => b.confidence - a.confidence);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="h-[400px] w-full rounded-2xl border border-border-visible bg-bg-card/50 p-6 backdrop-blur-sm"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted">
          Probability Distribution
        </h3>
        <span className="text-[10px] font-mono text-accent-green/60">7 CLINICAL CLASSES</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
          <XAxis 
            type="number" 
            domain={[0, 1]} 
            hide 
          />
          <YAxis 
            dataKey="label" 
            type="category" 
            axisLine={false}
            tickLine={false}
            width={120}
            tick={{ fill: '#8B92A5', fontSize: 12, fontWeight: 500 }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{ 
              backgroundColor: '#111827', 
              borderColor: '#1f2937',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#fff'
            }}
            formatter={(value: unknown) => {
              const numValue = typeof value === 'number' ? value : 0;
              return [ (numValue * 100).toFixed(2) + "%", "Confidence"];
            }}
          />
          <Bar 
            dataKey="confidence" 
            radius={[0, 4, 4, 0]} 
            animationDuration={1500}
            animationBegin={300}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? "#00E5A0" : "#374151"} 
                fillOpacity={index === 0 ? 0.9 : 0.6}
              />
            ))}
            <LabelList 
              dataKey="confidence" 
              position="right" 
              formatter={(val: unknown) => {
                const numVal = typeof val === 'number' ? val : 0;
                return (numVal * 100).toFixed(1) + "%";
              }}
              style={{ fill: '#8B92A5', fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
