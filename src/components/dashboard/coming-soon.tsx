import { Hammer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Placeholder for dashboard sections that are still being built.
export function ComingSoon({ name }: { name: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <Hammer className="size-10 text-muted-foreground" />
        <h2 className="text-lg font-semibold">{name} is coming soon</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          This section is being built and will be available shortly.
        </p>
      </CardContent>
    </Card>
  );
}
