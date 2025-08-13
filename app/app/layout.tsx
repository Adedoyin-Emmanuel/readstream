import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Afacad_Flux } from "next/font/google";

import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const afacadFlux = Afacad_Flux({
  variable: "--font-afacad-flux",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Readstream",
  description:
    "A simple tool to upload and preview README files in your browser",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en">
      <body className={`${afacadFlux.className} antialiased`}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            <div className="p-2">{children}</div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
