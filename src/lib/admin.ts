import type { Role } from "@/lib/roles";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  isBlocked: boolean;
  businessName: string | null;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt: string | null;
  createdAt: string | null;
};

export type AdminUserDetails = AdminUser & {
  menuItemCount: number;
  orderCount: number;
};

export type TransactionStatus = "pending" | "paid" | "failed" | "canceled" | "expired";

export const TRANSACTION_STATUSES: TransactionStatus[] = [
  "pending",
  "paid",
  "failed",
  "canceled",
  "expired",
];

export type AdminTransaction = {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: string;
  vendor: { id: string; name: string | null; businessName: string | null };
};

export type AdminOverviewData = {
  totals: {
    users: number;
    vendors: number;
    customers: number;
    menuItems: number;
    pendingMenuItems: number;
    transactions: number;
  };
  usersByRole: { role: string; count: number }[];
  menuItemsByStatus: { status: string; count: number }[];
  transactionsByMonth: { month: string; count: number; revenue: number }[];
};

// Amounts are stored in cents, exactly as Stripe reports them.
export function formatMoney(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
