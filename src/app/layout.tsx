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

const preloaderCheck = `try{if(sessionStorage.getItem("${PRELOADER_KEY}")==="1")document.documentElement.setAttribute("data-preloader","skip")}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://pizzahub-lamiakajal.vercel.app"),
  title: {
    default: "PizzaHub — Hot & Fresh Pizza Delivered",
    template: "%s | PizzaHub",
  },
  description:
    "Discover local pizza shops, browse their menus, and order your favorite pizza. Built by Lamia Kajal.",
  keywords: [
    "PizzaHub",
    "Lamia Kajal",
    "Pizza Ordering Platform",
    "Next.js",
    "Full Stack",
  ],
  authors: [{ name: "Lamia Kajal", url: "https://lamiakajal.com" }],
  creator: "Lamia Kajal",
  openGraph: {
    title: "PizzaHub — Hot & Fresh Pizza Delivered",
    description:
      "Discover local pizza shops, browse their menus, and order your favorite pizza. Built by Lamia Kajal.",
    url: "https://pizzahub-lamiakajal.vercel.app",
    siteName: "PizzaHub",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
