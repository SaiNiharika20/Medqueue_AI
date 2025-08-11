"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { chartData } from '@/lib/data';

const chartConfig = {
  patients: {
    label: 'Patients',
    color: 'hsl(var(--primary))',
  },
};

export function PatientFlowChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer config={chartConfig}>
            <BarChart data={chartData} accessibilityLayer>
                <XAxis
                    dataKey="hour"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                 <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    content={<ChartTooltipContent />}
                />
                <Bar dataKey="patients" fill="var(--color-patients)" radius={4} />
            </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
