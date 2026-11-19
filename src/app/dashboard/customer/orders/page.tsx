import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { OrderList } from "@/components/orders/order-list";

export const metadata: Metadata = { title: "My Orders" };

export default function MyOrdersPage() {
  return (
    <>
      <PageHeader
        title="My Orders"
        description="Track your orders. You can cancel an order while it is still pending."
      />
      <OrderList variant="customer" />
    </>
  );
}
