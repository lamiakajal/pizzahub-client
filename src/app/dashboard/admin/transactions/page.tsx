import type { Metadata } from "next";
import { AdminTransactions } from "@/components/admin/admin-transactions";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Transactions"
        description="Premium subscription payments from vendors. This list is read only."
      />
      <AdminTransactions />
    </>
  );
}
