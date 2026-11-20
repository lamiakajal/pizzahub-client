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
import {
  AXIS_TICK,
  ChartCard,
  EmptyChart,
  TOOLTIP_STYLE,
  summarize,
} from "@/components/charts/chart-parts";
import { formatMoney, titleCase, type AdminOverviewData } from "@/lib/admin";

const ROLE_COLORS: Record<string, string> = {
  customer: "var(--chart-1)",
  vendor: "var(--chart-2)",
  admin: "var(--chart-4)",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--chart-3)",
  approved: "var(--chart-4)",
  rejected: "var(--chart-1)",
  inactive: "var(--chart-5)",
};

export function AdminCharts({ data }: { data: AdminOverviewData }) {
  const roles = data.usersByRole.map((entry) => ({ ...entry, label: titleCase(entry.role) }));
  const statuses = data.menuItemsByStatus.map((entry) => ({
    ...entry,
    label: titleCase(entry.status),
  }));
  const hasUsers = roles.some((entry) => entry.count > 0);
  const hasItems = statuses.some((entry) => entry.count > 0);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Users by role"
        description="How accounts are split between roles."
        summary={`Users by role. ${summarize(roles.map((entry) => ({ label: entry.label, value: entry.count })))}`}
      >
        {hasUsers ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roles}
                dataKey="count"
                nameKey="label"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={2}
                stroke="var(--surface)"
              >
                {roles.map((entry) => (
                  <Cell key={entry.role} fill={ROLE_COLORS[entry.role] ?? "var(--chart-5)"} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 13, color: "var(--muted)" }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </ChartCard>

      <ChartCard
        title="Menu items by status"
        description="Where every submitted item stands."
        summary={`Menu items by status. ${summarize(statuses.map((entry) => ({ label: entry.label, value: entry.count })))}`}
      >
        {hasItems ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statuses} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "var(--surface-2)" }} />
              <Bar dataKey="count" name="Items" radius={[6, 6, 0, 0]}>
                {statuses.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "var(--chart-5)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </ChartCard>

      <div className="lg:col-span-2">
        <ChartCard
          title="Transactions per month"
          description="Subscription payments over the last 6 months. Revenue counts paid ones only."
          summary={`Transactions per month. ${summarize(data.transactionsByMonth.map((entry) => ({ label: entry.month, value: entry.count })))}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.transactionsByMonth} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                cursor={{ fill: "var(--surface-2)" }}
                formatter={(value, _name, item) => [
                  `${value} (${formatMoney(Number(item.payload?.revenue ?? 0))} revenue)`,
                  "Transactions",
                ]}
              />
              <Bar dataKey="count" name="Transactions" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
