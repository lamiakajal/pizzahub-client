"use client";

import { useState } from "react";
import { CreditCard, Search, TriangleAlert } from "lucide-react";
import { PizzaLoader } from "@/components/brand/pizza-loader";
import { Pager } from "@/components/dashboard/pager";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import {
  TRANSACTION_STATUSES,
  formatDate,
  formatMoney,
  titleCase,
  type AdminTransaction,
  type TransactionStatus,
} from "@/lib/admin";
import { useApiList } from "@/lib/use-api";
import { cn } from "@/lib/utils";

const STATUS_VARIANTS: Record<TransactionStatus, BadgeVariant> = {
  paid: "success",
  pending: "warning",
  failed: "error",
  canceled: "error",
  expired: "error",
};

// Read only on purpose: payment records are never edited from the dashboard.
export function AdminTransactions() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { items, meta, error, loading, reload } = useApiList<AdminTransaction>(
    "/api/admin/transactions",
    { search, status, page, limit: 10 }
  );

  return (
    <div className="space-y-6">
      <form
        key={search}
        onSubmit={(event) => {
          event.preventDefault();
          const value = String(new FormData(event.currentTarget).get("search") ?? "").trim();
          setSearch(value);
          setPage(1);
        }}
        className="grid gap-3 sm:grid-cols-[1fr_auto_auto]"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search by vendor or business name"
            className="pl-9"
            aria-label="Search transactions"
          />
        </div>
        <NativeSelect
          aria-label="Filter by status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {TRANSACTION_STATUSES.map((value) => (
            <option key={value} value={value}>
              {titleCase(value)}
            </option>
          ))}
        </NativeSelect>
        <Button type="submit">Search</Button>
      </form>

      {loading && items.length === 0 ? (
        <PizzaLoader label="Loading transactions" className="py-20" />
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <TriangleAlert className="size-10 text-error" />
            <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={reload}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <CreditCard className="size-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No transactions found</h2>
            <p className="text-sm text-muted-foreground">
              Payments appear here once vendors subscribe to Premium.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className={cn("py-0", loading && "opacity-60")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-176 text-left text-sm">
              <thead className="border-b border-border bg-surface-2 text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Vendor</th>
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {transaction.vendor.businessName || transaction.vendor.name || "Deleted vendor"}
                      </p>
                      {transaction.vendor.businessName && transaction.vendor.name && (
                        <p className="text-xs text-muted-foreground">{transaction.vendor.name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">{titleCase(transaction.plan)}</td>
                    <td className="px-4 py-3 font-semibold text-primary">
                      {formatMoney(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANTS[transaction.status] ?? "muted"}>
                        {titleCase(transaction.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(transaction.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {meta && <Pager page={meta.page} totalPages={meta.totalPages} onChange={setPage} disabled={loading} />}
    </div>
  );
}
