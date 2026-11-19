export const MENU_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const;

export type MenuStatus = "pending" | "approved" | "rejected" | "inactive";

export const MENU_STATUSES: MenuStatus[] = ["pending", "approved", "rejected", "inactive"];

export const STATUS_LABELS: Record<MenuStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  inactive: "Paused",
};

export type MenuVendor = {
  id?: string;
  name?: string;
  image?: string | null;
  businessName?: string | null;
};

export type MenuItem = {
  _id: string;
  vendorId: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: MenuStatus;
  createdAt: string;
  isPremium?: boolean;
  vendor?: MenuVendor;
};

export const MAX_MENU_IMAGES = 4;

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function vendorDisplayName(item: Pick<MenuItem, "vendor">) {
  return item.vendor?.businessName || item.vendor?.name || "Local vendor";
}
