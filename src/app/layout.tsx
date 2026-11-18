import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeScript } from "@/components/theme/theme-script";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "PizzaHub — Hot & Fresh Pizza Delivered",
    template: "%s | PizzaHub",
  },
  description:
    "Discover local pizza shops, browse their menus and order your favorite pizza.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // data-theme is set by the inline script before paint, so hydration may differ.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
