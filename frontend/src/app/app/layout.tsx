import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume AI — Analyzer",
  description: "Upload your resume and analyze it against any job description.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
