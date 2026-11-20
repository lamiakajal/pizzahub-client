import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Preloader } from "@/components/brand/preloader";
import { ThemeScript } from "@/components/theme/theme-script";
import { Toaster } from "@/components/ui/sonner";
import { PRELOADER_KEY } from "@/lib/preloader";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Marks repeat visits in this browser session so the intro can be hidden before first paint.
const preloaderCheck = `try{if(sessionStorage.getItem("${PRELOADER_KEY}")==="1")document.documentElement.setAttribute("data-preloader","skip")}catch(e){}`;

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
      data-theme="dark"
      suppressHydrationWarning
      className={`${poppins.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans"
      >
        <Script
          id="pizzahub-preloader-check"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: preloaderCheck }}
        />
        <Preloader />
        <noscript>
          <style>{".preloader{display:none}"}</style>
        </noscript>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
