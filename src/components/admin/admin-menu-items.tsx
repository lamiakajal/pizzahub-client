"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Pause, Search, Trash2, TriangleAlert, UtensilsCrossed, X } from "lucide-react";
import { toast } from "sonner";
import { Pager } from "@/components/dashboard/pager";
import { PizzaLoader } from "@/components/brand/pizza-loader";
import { StatusBadge } from "@/components/menu/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import type { PageMeta } from "@/lib/api";
import { apiRequest, errorMessage } from "@/lib/api-client";
import {
  MENU_CATEGORIES,
  MENU_STATUSES,
  STATUS_LABELS,
  formatPrice,
  vendorDisplayName,
  type MenuItem,
  type MenuStatus,
} from "@/lib/menu";
import { cn } from "@/lib/utils";

type Result = { key: string; items: MenuItem[]; meta?: PageMeta; error?: string };

export function AdminMenuItems() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const key = `${search}|${status}|${category}|${page}|${reload}`;
  const loading = result?.key !== key;

  useEffect(() => {
    let cancelled = false;

    apiRequest<MenuItem[]>("/api/admin/menu-items", {
      params: { search, status, category, page, limit: 10 },
    })
      .then(({ data, meta }) => !cancelled && setResult({ key, items: data, meta }))
      .catch((error) => !cancelled && setResult({ key, items: [], error: errorMessage(error) }));

    return () => {
      cancelled = true;
    };
  }, [key, search, status, category, page]);

  async function run(item: MenuItem, action: () => Promise<unknown>, success: string) {
    setBusyId(item._id);
    try {
      await action();
      toast.success(success);
      setConfirmId(null);
      setReload((value) => value + 1);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  }

  function changeStatus(item: MenuItem, next: MenuStatus) {
    return run(
      item,
      () =>
        apiRequest(`/api/admin/menu-items/${item._id}/status`, {
          method: "PATCH",
          body: { status: next },
        }),
      `Marked as ${STATUS_LABELS[next].toLowerCase()}`
    );
  }

  function remove(item: MenuItem) {
    if (result && result.items.length === 1 && page > 1) setPage(page - 1);
    return run(
      item,
      () => apiRequest(`/api/admin/menu-items/${item._id}`, { method: "DELETE" }),
      "Menu item deleted"
    );
  }

  const meta = result?.meta;

  return (
    <div className="space-y-6">
      <form
        key={`${search}`}
        onSubmit={(event) => {
          event.preventDefault();
          const value = String(new FormData(event.currentTarget).get("search") ?? "").trim();
          setSearch(value);
          setPage(1);
        }}
        className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search by item name or location"
            className="pl-9"
            aria-label="Search menu items"
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
          {MENU_STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          aria-label="Filter by category"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {MENU_CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </NativeSelect>
        <Button type="submit">Search</Button>
      </form>

      {loading ? (
        <PizzaLoader label="Loading menu items" className="py-20" />
      ) : result?.error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <TriangleAlert className="size-10 text-error" />
            <p className="max-w-sm text-sm text-muted-foreground">{result.error}</p>
            <Button variant="outline" onClick={() => setReload((value) => value + 1)}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : result && result.items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <UtensilsCrossed className="size-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No menu items found</h2>
            <p className="text-sm text-muted-foreground">Try changing the search or filters.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-176 text-left text-sm">
              <thead className="border-b border-border bg-surface-2 text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Item</th>
                  <th className="px-4 py-3 font-semibold">Vendor</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {result?.items.map((item) => {
                  const busy = busyId === item._id;
                  return (
                    <tr key={item._id} className={cn("border-b border-border last:border-0", busy && "opacity-60")}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                            {item.images[0] && (
                              <Image src={item.images[0]} alt="" fill sizes="48px" className="object-cover" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{item.itemName}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.category} · {item.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{vendorDisplayName(item)}</td>
                      <td className="px-4 py-3 font-semibold text-primary">{formatPrice(item.price)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3">
                        {confirmId === item._id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs font-medium">Delete?</span>
                            <Button size="sm" variant="destructive" disabled={busy} onClick={() => remove(item)}>
                              Yes
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setConfirmId(null)}>
                              No
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            {item.status !== "approved" && (
                              <Button size="sm" variant="outline" disabled={busy} onClick={() => changeStatus(item, "approved")}>
                                <Check /> Approve
                              </Button>
                            )}
                            {item.status !== "rejected" && (
                              <Button size="sm" variant="outline" disabled={busy} onClick={() => changeStatus(item, "rejected")}>
                                <X /> Reject
                              </Button>
                            )}
                            {item.status === "approved" && (
                              <Button size="sm" variant="outline" disabled={busy} onClick={() => changeStatus(item, "inactive")}>
                                <Pause /> Pause
                              </Button>
                            )}
                            <Button size="sm" variant="outline" disabled={busy} onClick={() => setConfirmId(item._id)}>
                              <Trash2 /> Delete
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {meta && <Pager page={meta.page} totalPages={meta.totalPages} onChange={setPage} disabled={loading} />}
    </div>
  );
}
