import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/layout/social-icons";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
];

const SOCIAL_LINKS = [
  { href: "https://x.com", label: "X", Icon: XIcon },
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://youtube.com", label: "YouTube", Icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Link href="/" aria-label="PizzaHub home" className="inline-block">
            <Logo />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Discover local pizza shops, browse their menus and get hot, fresh
            pizza delivered to your door.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>123 Culinary Ave, Suite 100</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href="tel:+15550000000" className="hover:text-primary">
                +1 (555) 000-0000
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" />
              <a
                href="mailto:support@pizzahub.com"
                className="hover:text-primary"
              >
                support@pizzahub.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Follow Us
          </h3>
          <ul className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} PizzaHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
