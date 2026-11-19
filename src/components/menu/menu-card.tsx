import Image from "next/image";
import Link from "next/link";
import { MapPin, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice, vendorDisplayName, type MenuItem } from "@/lib/menu";

// Every card has the same height and image size, so grids stay tidy.
export function MenuCard({ item, priority = false }: { item: MenuItem; priority?: boolean }) {
  return (
    <Card className="h-full gap-0 overflow-hidden py-0">
      <div className="relative aspect-4/3 w-full bg-muted">
        {item.images[0] && (
          <Image
            src={item.images[0]}
            alt={item.itemName}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <Badge className="absolute top-3 left-3 bg-surface/90 backdrop-blur">
          {item.category}
        </Badge>
        {item.isPremium && (
          <Badge variant="brand" className="absolute top-3 right-3">
            Premium
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold">{item.itemName}</h3>
          <p className="text-lg font-bold text-primary">{formatPrice(item.price)}</p>
        </div>

        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{item.description}</p>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <Store className="size-4 shrink-0" />
            <span className="line-clamp-1">{vendorDisplayName(item)}</span>
          </p>
        </div>

        <Button asChild className="mt-auto w-full">
          <Link href={`/menu/${item._id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
}
