import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

// Public pages share the navbar and footer. Dashboards use their own layout.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
