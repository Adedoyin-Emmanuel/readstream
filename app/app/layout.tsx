import type { Metadata } from "next";
import { Afacad_Flux } from "next/font/google";

import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${afacadFlux.className} antialiased`}>{children}</body>
    </html>
  );
}
