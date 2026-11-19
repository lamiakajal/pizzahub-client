import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Store, TriangleAlert } from "lucide-react";
import { ImageGallery } from "@/components/menu/image-gallery";
import { OrderPanel } from "@/components/menu/order-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiGet, ApiRequestError } from "@/lib/api";
import { formatPrice, vendorDisplayName, type MenuItem } from "@/lib/menu";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Menu Item" };

function ItemProblem({ title, message }: { title: string; message: string }) {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 px-4 pb-16 sm:px-6">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <TriangleAlert className="size-10 text-error" />
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
          <Button asChild variant="outline">
            <Link href="/menu">
              <ArrowLeft /> Back to menu
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

export default async function MenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Item details are private: signed-out visitors go to Sign In and come back here.
  const { user, role } = await requireUser(`/menu/${id}`);

  let item: MenuItem;
  try {
    item = (await apiGet<MenuItem>(`/api/menu-items/${encodeURIComponent(id)}`)).data;
  } catch (error) {
    if (error instanceof ApiRequestError && (error.status === 400 || error.status === 404)) {
      return (
        <ItemProblem
          title="Menu item not found"
          message="This item does not exist, or it is no longer available."
        />
      );
    }
    return (
      <ItemProblem
        title="We could not load this item"
        message={error instanceof Error ? error.message : "Please try again in a moment."}
      />
    );
  }

  const isOwnItem = item.vendorId === user.id;

  return (
    <section className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3">
        <Link href="/menu">
          <ArrowLeft /> Back to menu
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-2">
        <ImageGallery images={item.images} alt={item.itemName} />

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{item.category}</Badge>
              {item.isPremium && <Badge variant="brand">Premium vendor</Badge>}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{item.itemName}</h1>
            <p className="text-3xl font-bold text-primary">{formatPrice(item.price)}</p>
          </div>

          <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
            {item.description}
          </p>

          <Card>
            <CardContent className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary" />
                <span>{item.location}</span>
              </p>
              <p className="flex items-center gap-2">
                <Store className="size-4 shrink-0 text-primary" />
                <span>
                  Sold by <span className="font-semibold">{vendorDisplayName(item)}</span>
                </span>
              </p>
            </CardContent>
          </Card>

          <OrderPanel role={role} isOwnItem={isOwnItem} />
        </div>
      </div>
    </section>
  );
}
