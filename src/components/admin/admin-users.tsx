"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp, Search, ShieldBan, ShieldCheck, TriangleAlert, Users } from "lucide-react";
import { toast } from "sonner";
import { PizzaLoader } from "@/components/brand/pizza-loader";
import { Pager } from "@/components/dashboard/pager";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { formatDate, titleCase, type AdminUser, type AdminUserDetails } from "@/lib/admin";
import { apiRequest, errorMessage } from "@/lib/api-client";
import { ROLES } from "@/lib/roles";
import { useApiData, useApiList } from "@/lib/use-api";
import { cn } from "@/lib/utils";

const ROLE_VARIANTS: Record<string, BadgeVariant> = {
  admin: "brand",
  vendor: "default",
  customer: "muted",
};

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

export function AdminUsers({ currentUserId }: { currentUserId: string }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [blocked, setBlocked] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [detailsReload, setDetailsReload] = useState(0);

  const { items, meta, error, loading, reload } = useApiList<AdminUser>("/api/admin/users", {
    search,
    role,
    blocked,
    page,
    limit: 10,
  });

  async function setBlockedState(user: AdminUser, next: boolean) {
    setBusyId(user.id);
    try {
      await apiRequest(`/api/admin/users/${user.id}/block`, {
        method: "PATCH",
        body: { blocked: next },
      });
      toast.success(next ? "User blocked" : "User unblocked");
      setConfirmId(null);
      setDetailsReload((value) => value + 1);
      reload();
    } catch (failure) {
      toast.error(errorMessage(failure));
    } finally {
      setBusyId(null);
    }
  }

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
        className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search by name or email"
            className="pl-9"
            aria-label="Search users"
          />
        </div>
        <NativeSelect
          aria-label="Filter by role"
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All roles</option>
          {ROLES.map((value) => (
            <option key={value} value={value}>
              {titleCase(value)}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          aria-label="Filter by account state"
          value={blocked}
          onChange={(event) => {
            setBlocked(event.target.value);
            setPage(1);
          }}
        >
          <option value="">Active and blocked</option>
          <option value="false">Active only</option>
          <option value="true">Blocked only</option>
        </NativeSelect>
        <Button type="submit">Search</Button>
      </form>

      {loading && items.length === 0 ? (
        <PizzaLoader label="Loading users" className="py-20" />
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
            <Users className="size-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No users found</h2>
            <p className="text-sm text-muted-foreground">Try changing the search or filters.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className={cn("py-0", loading && "opacity-60")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-176 text-left text-sm">
              <thead className="border-b border-border bg-surface-2 text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((user) => {
                  const busy = busyId === user.id;
                  const expanded = expandedId === user.id;
                  // Admins (and the signed-in admin) can never be blocked.
                  const protectedUser = user.role === "admin" || user.id === currentUserId;

                  return (
                    <Fragment key={user.id}>
                      <tr className={cn("border-b border-border", !expanded && "last:border-0", busy && "opacity-60")}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar size="lg">
                              {user.image && <AvatarImage src={user.image} alt="" />}
                              <AvatarFallback>{initials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {user.name || "Unnamed user"}
                                {user.id === currentUserId && (
                                  <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>
                                )}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={ROLE_VARIANTS[user.role] ?? "muted"}>{titleCase(user.role)}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-3">
                          {user.isBlocked ? (
                            <Badge variant="error">Blocked</Badge>
                          ) : (
                            <Badge variant="success">Active</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {confirmId === user.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs font-medium">
                                {user.isBlocked ? "Unblock?" : "Block?"}
                              </span>
                              <Button
                                size="sm"
                                variant={user.isBlocked ? "default" : "destructive"}
                                disabled={busy}
                                onClick={() => setBlockedState(user, !user.isBlocked)}
                              >
                                Yes
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setConfirmId(null)}>
                                No
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                aria-expanded={expanded}
                                onClick={() => setExpandedId(expanded ? null : user.id)}
                              >
                                {expanded ? <ChevronUp /> : <ChevronDown />} Details
                              </Button>
                              {!protectedUser && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={busy}
                                  onClick={() => setConfirmId(user.id)}
                                >
                                  {user.isBlocked ? <ShieldCheck /> : <ShieldBan />}
                                  {user.isBlocked ? "Unblock" : "Block"}
                                </Button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="border-b border-border bg-surface-2 last:border-0">
                          <td colSpan={5} className="px-4 py-4">
                            <UserDetails id={user.id} reloadKey={detailsReload} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
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

function UserDetails({ id, reloadKey }: { id: string; reloadKey: number }) {
  // The reload key changes after a block or unblock so the panel stays current.
  const { data, error, loading, reload } = useApiData<AdminUserDetails>(
    `/api/admin/users/${id}?v=${reloadKey}`
  );

  if (loading && !data && !error) {
    return <div className="h-16 animate-pulse rounded-lg bg-muted" aria-busy="true" />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <TriangleAlert className="size-4 text-error" />
        <span className="text-muted-foreground">{error ?? "Could not load user details."}</span>
        <Button size="sm" variant="outline" onClick={reload}>
          Try again
        </Button>
      </div>
    );
  }

  const isVendor = data.role === "vendor";

  return (
    <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
      <Detail label="Email" value={data.email} />
      <Detail label="Joined" value={formatDate(data.createdAt)} />
      {isVendor && <Detail label="Business" value={data.businessName || "Not set"} />}
      {isVendor && (
        <Detail
          label="Plan"
          value={
            data.subscriptionPlan === "premium"
              ? `Premium${data.subscriptionExpiresAt ? ` until ${formatDate(data.subscriptionExpiresAt)}` : ""}`
              : "Free"
          }
        />
      )}
      {isVendor && <Detail label="Menu items" value={String(data.menuItemCount)} />}
      <Detail label={isVendor ? "Orders received" : "Orders"} value={String(data.orderCount)} />
    </dl>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-0.5">
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="font-medium break-words">{value}</dd>
    </div>
  );
}
