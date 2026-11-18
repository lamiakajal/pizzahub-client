import {
  ClipboardList,
  Crown,
  LayoutDashboard,
  Plus,
  Receipt,
  ShoppingBag,
  UserRound,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/roles";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

// Sidebar links for each role. Pages not built yet show a placeholder.
export const DASHBOARD_NAV: Record<Role, DashboardNavItem[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/vendor/menu-items", label: "My Menu Items", icon: UtensilsCrossed },
    { href: "/dashboard/vendor/menu-items/new", label: "Add Menu Item", icon: Plus },
    { href: "/dashboard/vendor/orders", label: "Customer Orders", icon: ClipboardList },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: Crown },
    { href: "/dashboard/vendor/profile", label: "Profile Settings", icon: UserRound },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/dashboard/customer/profile", label: "Profile Settings", icon: UserRound },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/menu-items", label: "Manage Menu Items", icon: UtensilsCrossed },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
  ],
};

export const ROLE_LABELS: Record<Role, string> = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Admin",
};
