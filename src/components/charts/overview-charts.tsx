"use client";

import {
  BarsChart,
  ChartCard,
  DonutChart,
  STATUS_COLORS,
  summarize,
  type ChartDatum,
} from "@/components/charts/chart-parts";
import { MENU_STATUSES, STATUS_LABELS, type MenuStatus } from "@/lib/menu";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orders";

export type OrdersByStatus = { status: OrderStatus; count: number }[];
export type OrdersByMonth = { month: string; count: number }[];
export type ItemsByStatus = { status: MenuStatus; count: number }[];

export function OrdersByStatusChart({ data }: { data: OrdersByStatus }) {
  const chart: ChartDatum[] = data.map((entry) => ({
    label: ORDER_STATUS_LABELS[entry.status],
    value: entry.count,
    color: STATUS_COLORS[entry.status],
  }));

  return (
    <ChartCard
      title="Orders by status"
      description="Where all of your orders stand."
      summary={`Orders by status. ${summarize(chart)}`}
      empty={chart.every((entry) => entry.value === 0)}
    >
      <DonutChart data={chart} />
    </ChartCard>
  );
}

export function OrdersByMonthChart({
  data,
  title = "Orders per month",
}: {
  data: OrdersByMonth;
  title?: string;
}) {
  const chart: ChartDatum[] = data.map((entry) => ({ label: entry.month, value: entry.count }));

  return (
    <ChartCard
      title={title}
      description="The last 6 months."
      summary={`${title}. ${summarize(chart)}`}
      empty={chart.every((entry) => entry.value === 0)}
    >
      <BarsChart data={chart} name="Orders" color="var(--chart-2)" />
    </ChartCard>
  );
}

export function ItemsByStatusChart({ data }: { data: ItemsByStatus }) {
  const chart: ChartDatum[] = MENU_STATUSES.map((status) => ({
    label: STATUS_LABELS[status],
    value: data.find((entry) => entry.status === status)?.count ?? 0,
    color: STATUS_COLORS[status],
  }));

  return (
    <ChartCard
      title="Menu items by status"
      description="Review progress of the items you submitted."
      summary={`Menu items by status. ${summarize(chart)}`}
      empty={chart.every((entry) => entry.value === 0)}
    >
      <BarsChart data={chart} name="Items" />
    </ChartCard>
  );
}
