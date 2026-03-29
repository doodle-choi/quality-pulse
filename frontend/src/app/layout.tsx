import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";

// Configure Dual Fonts (The Analytical Architect / Command Center)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quality Pulse | Analytics Dashboard",
  description: "Global Appliance Defect and Recall Integrated Control Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Material Symbols Outlined — Stitch-mandated icon font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} antialiased font-sans min-h-screen bg-surface text-text selection:bg-primary/30`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <SidebarProvider>
            <div className="flex min-h-screen relative">
              <Sidebar />
              {/* Main content area pushed by sidebar width (w-64 = 256px) */}
              <div className="flex-1 flex flex-col min-w-0 md:ml-64">
                <Header />
                <main className="flex-1 px-5 py-6 md:px-8 md:py-12 w-full max-w-[1400px] mx-auto">
                  {children}
                </main>
              </div>
            </div>

            {/* Global Decoration — Stitch ambient blur circles */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-slate-200/20 dark:bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-64 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
