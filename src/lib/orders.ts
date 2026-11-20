export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = ["pending", "accepted", "rejected", "cancelled"];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export type Order = {
  _id: string;
  status: OrderStatus;
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  item: {
    _id: string;
    itemName: string;
    images?: string[];
    price?: number;
    category?: string;
  } | null;
  vendor: {
    _id: string;
    name?: string;
    image?: string | null;
    businessName?: string | null;
  } | null;
  customer: {
    _id: string;
    name?: string;
    email?: string;
    image?: string | null;
  } | null;
};

// Delivery dates are whole days stored in UTC, so they are shown in UTC too.
export function formatDeliveryDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatRequestedAt(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Today's date in the visitor's own time zone, as the value a date input expects.
export function todayInputValue() {
  const now = new Date();
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
