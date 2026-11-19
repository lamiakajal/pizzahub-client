import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { OrderList } from "@/components/orders/order-list";

export const metadata: Metadata = { title: "Customer Orders" };

export default function CustomerOrdersPage() {
  return (
    <>
      <PageHeader
        title="Customer Orders"
        description="Accept or reject incoming orders. A pending order can be answered once."
      />
      <OrderList variant="vendor" />
    </>
  );
}
