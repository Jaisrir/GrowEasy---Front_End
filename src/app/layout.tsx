import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowEasy - Leads Management",
  description:
    "Upload any CSV and let AI map it into GrowEasy CRM lead records.",
  icons: {
    icon: "/groweasy_ai_logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
