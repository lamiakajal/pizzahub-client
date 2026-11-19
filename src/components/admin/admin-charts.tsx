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
import { formatMoney, titleCase, type AdminOverviewData } from "@/lib/admin";

const AXIS_TICK = { fill: "var(--muted)", fontSize: 12 };

const TOOLTIP_STYLE = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--text)",
  fontSize: 13,
};

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

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="h-64 w-full">{children}</div>
      </CardContent>
    </Card>
  );
}

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
      <ChartCard title="Users by role" description="How accounts are split between roles.">
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

      <ChartCard title="Menu items by status" description="Where every submitted item stands.">
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

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Nothing to show yet.
    </div>
  );
}
