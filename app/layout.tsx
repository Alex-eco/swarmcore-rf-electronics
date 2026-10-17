import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwarmCore RF & Electronics — AI Agents for Autonomous RF & Electronics Engineering Development",
  description: "A multi-agent engineering automation initiative exploring technical research, component intelligence, engineering calculations, CAD workflows, and the long-term goal of end-to-end microwave device development.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
