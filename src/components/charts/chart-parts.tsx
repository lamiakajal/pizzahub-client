"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export const AXIS_TICK = { fill: "var(--muted)", fontSize: 12 };

export const TOOLTIP_STYLE = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--text)",
  fontSize: 13,
};

// Same colors the status badges use, so charts and badges always agree.
export const STATUS_COLORS: Record<string, string> = {
  pending: "var(--warning)",
  approved: "var(--success)",
  accepted: "var(--success)",
  rejected: "var(--error)",
  cancelled: "var(--muted)",
  inactive: "var(--muted)",
};

export type ChartDatum = { label: string; value: number; color?: string };

// Wraps a chart in a card. The summary is read aloud by screen readers.
export function ChartCard({
  title,
  description,
  summary,
  empty,
  children,
}: {
  title: string;
  description: string;
  summary: string;
  empty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="h-64 w-full" role="img" aria-label={summary}>
          {empty ? <EmptyChart /> : children}
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Nothing to show yet.
    </div>
  );
}

export function summarize(data: ChartDatum[]) {
  return data.map((entry) => `${entry.label}: ${entry.value}`).join(", ");
}

export function DonutChart({ data }: { data: ChartDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
          stroke="var(--surface)"
        >
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.color ?? "var(--chart-5)"} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 13, color: "var(--muted)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// One bar per entry. Entries may bring their own color.
export function BarsChart({
  data,
  name,
  color = "var(--chart-2)",
}: {
  data: ChartDatum[];
  name: string;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "var(--surface-2)" }} />
        <Bar dataKey="value" name={name} fill={color} radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.color ?? color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
