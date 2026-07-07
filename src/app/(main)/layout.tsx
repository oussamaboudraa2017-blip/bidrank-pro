"use client";

import { Navbar } from "@/components/bidrank/navbar";
import { Footer } from "@/components/bidrank/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-br-light">
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}