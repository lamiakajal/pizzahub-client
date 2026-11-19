"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Crown, Eye, Pause, Pencil, Play, Plus, Trash2, TriangleAlert, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Pager } from "@/components/dashboard/pager";
import { StatusBadge } from "@/components/menu/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PageMeta } from "@/lib/api";
import { apiRequest, errorMessage } from "@/lib/api-client";
import {
  MENU_STATUSES,
  STATUS_LABELS,
  formatPrice,
  type MenuItem,
  type MenuStatus,
} from "@/lib/menu";
import { cn } from "@/lib/utils";

type Result = { key: string; items: MenuItem[]; meta?: PageMeta; error?: string };

export function VendorMenuItems() {
  const [status, setStatus] = useState<MenuStatus | "">("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const key = `${status}|${page}|${reload}`;
  const loading = result?.key !== key;

  useEffect(() => {
    let cancelled = false;

    apiRequest<MenuItem[]>("/api/vendor/menu-items", {
      params: { status, page, limit: 8 },
    })
      .then(({ data, meta }) => !cancelled && setResult({ key, items: data, meta }))
      .catch((error) => !cancelled && setResult({ key, items: [], error: errorMessage(error) }));

    return () => {
      cancelled = true;
    };
  }, [key, status, page]);

  function changeStatus(next: MenuStatus | "") {
    setStatus(next);
    setPage(1);
  }

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

  function toggleAvailability(item: MenuItem) {
    const available = item.status === "inactive";
    return run(
      item,
      () =>
        apiRequest(`/api/vendor/menu-items/${item._id}/availability`, {
          method: "PATCH",
          body: { available },
        }),
      available ? "Item is available again" : "Item paused"
    );
  }

  function remove(item: MenuItem) {
    // Step back a page if this was the last item on it.
    if (result && result.items.length === 1 && page > 1) setPage(page - 1);
    return run(
      item,
      () => apiRequest(`/api/vendor/menu-items/${item._id}`, { method: "DELETE" }),
      "Menu item deleted"
    );
  }

  const meta = result?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {([{ value: "", label: "All" }, ...MENU_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))] as const).map(
            (option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => changeStatus(option.value as MenuStatus | "")}
                aria-pressed={status === option.value}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  status === option.value
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border bg-surface hover:bg-surface-2"
                )}
              >
                {option.label}
              </button>
            )
          )}
        </div>

        <Button asChild>
          <Link href="/dashboard/vendor/menu-items/new">
            <Plus /> Add Menu Item
          </Link>
        </Button>
      </div>

      {meta && meta.activeCount !== undefined && (
        <Card>
          <CardContent className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold">Active items:</span> {meta.activeCount}
              {meta.activeLimit ? ` of ${meta.activeLimit} (Free plan)` : " (Premium, unlimited)"}
            </p>
            {meta.activeLimit ? (
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/vendor/subscription">
                  <Crown /> Upgrade for unlimited items
                </Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
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
            <h2 className="text-lg font-semibold">No menu items here yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              {status ? "No items match this filter." : "Add your first pizza to start selling."}
            </p>
            {!status && (
              <Button asChild>
                <Link href="/dashboard/vendor/menu-items/new">Add Menu Item</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {result?.items.map((item) => {
            const busy = busyId === item._id;
            const canToggle = item.status === "approved" || item.status === "inactive";

            return (
              <Card key={item._id} className={cn(busy && "opacity-60")}>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-36">
                    {item.images[0] && (
                      <Image src={item.images[0]} alt={item.itemName} fill sizes="150px" className="object-cover" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">{item.itemName}</h3>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.category} · {item.location}
                    </p>
                    <p className="font-bold text-primary">{formatPrice(item.price)}</p>
                  </div>

                  {confirmId === item._id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">Delete this item?</span>
                      <Button size="sm" variant="destructive" disabled={busy} onClick={() => remove(item)}>
                        Yes, delete
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirmId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {item.status === "approved" && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/menu/${item._id}`}>
                            <Eye /> View
                          </Link>
                        </Button>
                      )}
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/vendor/menu-items/${item._id}/edit`}>
                          <Pencil /> Edit
                        </Link>
                      </Button>
                      {canToggle && (
                        <Button size="sm" variant="outline" disabled={busy} onClick={() => toggleAvailability(item)}>
                          {item.status === "approved" ? <Pause /> : <Play />}
                          {item.status === "approved" ? "Pause" : "Resume"}
                        </Button>
                      )}
                      <Button size="sm" variant="outline" disabled={busy} onClick={() => setConfirmId(item._id)}>
                        <Trash2 /> Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {meta && <Pager page={meta.page} totalPages={meta.totalPages} onChange={setPage} disabled={loading} />}
    </div>
  );
}
