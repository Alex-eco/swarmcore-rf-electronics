import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwarmCore — AI Agents for Electronic Component Replacement",
  description: "AI-assisted electronic component replacement research, datasheet comparison, compatibility risk assessment, and engineer-reviewed redesign recommendations.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
