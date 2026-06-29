import "@/app/globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import TanstackProvider from "@/components/providers/TanstackProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";
import NotificationListener from "@/components/shared/NotificationListener";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tracking Truck | Manajemen Truk",
  description: "Sistem pelacakan dan manajemen truk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${inter.variable} antialiased selection:bg-primary/20`}>
        <AuthProvider>
          <TanstackProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              <div className="relative min-h-screen flex flex-col lg:flex-row bg-background/50">
                <Navbar />
                <main className="flex-1 relative z-10 animate-reveal lg:pl-72 pt-16 lg:pt-0">
                  {children}
                </main>
              </div>
              <NotificationListener />
              <Toaster position="top-right" richColors expand={false}/>
            </ThemeProvider>
          </TanstackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
