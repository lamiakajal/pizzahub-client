"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";
import { toRole, type Role } from "@/lib/roles";
import { useScrolled } from "@/lib/use-scrolled";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

const PUBLIC_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
];

// Extra links that depend on who is signed in.
const ROLE_LINKS: Record<Role, NavLink[]> = {
  customer: [{ href: "/dashboard/customer/orders", label: "My Orders" }],
  vendor: [
    { href: "/dashboard/vendor/menu-items", label: "My Menu Items" },
    { href: "/dashboard/vendor/orders", label: "Customer Orders" },
  ],
  admin: [{ href: "/dashboard/admin/users", label: "Manage Users" }],
};

function initials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  const isHome = pathname === "/";
  // On the home page the bar sits over the dark hero until the visitor scrolls.
  const overHero = isHome && !scrolled;

  const user = session?.user;
  const links = user
    ? [...PUBLIC_LINKS, ...ROLE_LINKS[toRole(user.role)]]
    : PUBLIC_LINKS;

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function desktopLinkClass(active: boolean) {
    return cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      overHero
        ? active
          ? "bg-white/15 text-white"
          : "text-white/80 hover:text-white"
        : active
          ? "text-primary"
          : "text-foreground/80 hover:text-foreground"
    );
  }

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    toast.success("You have been signed out");
    router.push("/");
    router.refresh();
  }

  const overHeroButton = "text-white hover:bg-white/10 hover:text-white";

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-50 px-3 sm:px-6">
        <div
          className={cn(
            "mx-auto w-full max-w-7xl rounded-2xl border transition-colors duration-300",
            overHero
              ? "border-white/15 bg-black/40 text-white backdrop-blur-md"
              : "border-border bg-surface/80 text-foreground shadow-sm backdrop-blur-lg"
          )}
        >
          <div className="flex h-16 items-center justify-between gap-4 px-4">
            <Link href="/" aria-label="PizzaHub home" onClick={() => setOpen(false)}>
              <Logo onDark={overHero} />
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={desktopLinkClass(isActive(link.href))}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle className={cn(overHero && overHeroButton)} />

              {isPending ? (
                <div
                  className={cn(
                    "h-9 w-24 animate-pulse rounded-md",
                    overHero ? "bg-white/20" : "bg-muted"
                  )}
                />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      aria-label="Open profile menu"
                    >
                      <Avatar>
                        <AvatarImage src={user.image ?? undefined} alt={user.name} />
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel className="font-normal">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <LayoutDashboard /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserRound /> Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleSignOut}>
                      <LogOut /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden items-center gap-2 md:flex">
                  <Button
                    asChild
                    variant="ghost"
                    className={cn(overHero && overHeroButton)}
                  >
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              )}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("md:hidden", overHero && overHeroButton)}
                onClick={() => setOpen((value) => !value)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu: always a solid frosted panel, so links stay readable. */}
        {open && (
          <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-border bg-surface/95 p-3 text-foreground shadow-lg backdrop-blur-lg md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive(link.href)
                      ? "bg-surface-2 text-primary"
                      : "text-foreground/80 hover:bg-surface-2"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {!isPending && !user && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* The bar floats above the page, so other pages need room below it.
          The home page hero runs underneath it instead. */}
      {!isHome && <div className="h-28 sm:h-32" aria-hidden="true" />}
    </>
  );
}
