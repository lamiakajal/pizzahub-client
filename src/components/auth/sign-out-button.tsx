"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await signOut();
    toast.success("You have been signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <Button onClick={handleClick} disabled={loading} variant="outline">
      {loading && <LoaderCircle className="animate-spin" />}
      Sign Out
    </Button>
  );
}
