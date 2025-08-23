import type { Metadata } from "next";
import "./globals.css";
import { DashboardLayout } from "@/components/dashboard-layout";

export const metadata: Metadata = {
  title: "AAGATE Dashboard",
  description: "Agentic AI Governance Assurance & Trust Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
