import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResuMate MCP — AI-Powered ATS Analysis & Career Tools",
  description: "Upload your resume, paste a job URL, and get instant ATS scores, interview questions, skill gap analysis, and a cover letter — all powered by MCP AI tools.",
};

import { ThemeProvider } from "@/components/template/theme-provider";
import localFont from "next/font/local";

const musashi = localFont({
  src: "../../public/font/musashi-brush-font/MusashiBrush-MA0vn.otf",
  variable: "--font-musashi",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${musashi.variable} bg-white dark:bg-[#04060a] text-slate-900 dark:text-[#e2e8f0] transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
