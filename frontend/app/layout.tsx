import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, History, BarChart3, CheckSquare } from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "DayTrack | Capture Your Daily Wins",
  description: "A premium, real-time productivity tracker to manage your tasks and analyze your performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans flex min-h-screen bg-zinc-50`}>
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 ml-64 min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
