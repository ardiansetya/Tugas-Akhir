"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Truck, LogOut, User, Bell, LayoutDashboard, Map, Settings, MapPin, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleTheme } from "./ToggleTheme";
import { useProfile } from "@/hooks";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda", icon: LayoutDashboard },
  { href: "/pengiriman", label: "Pengiriman", icon: Map },
  { href: "/rute", label: "Rute", icon: MapPin },
  { href: "/truk", label: "Truk", icon: Truck },
  { href: "/driver", label: "Driver", icon: Users },
  { href: "/transit-driver", label: "Transit", icon: Activity },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: user } = useProfile();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* =========================================================
          DESKTOP SIDEBAR
          ========================================================= */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:flex w-72 flex-col border-r border-border/40 bg-card/30 backdrop-blur-2xl px-6 py-8 shadow-sm">
        {/* Brand Logo */}
        <div className="px-2 mb-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="p-2.5 bg-primary rounded-2xl shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight leading-none">
                Tracking<span className="text-primary">Truck</span>
              </span>
              <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-1">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 relative group/btn",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-7 bg-primary rounded-r-full" />
                )}
                <link.icon className={cn(
                  "h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110",
                  isActive ? "text-primary" : "text-muted-foreground/75"
                )} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area - Profile, Theme, and LogOut */}
        <div className="mt-auto space-y-6 pt-6 border-t border-border/40 px-1">
          {/* User Information Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-3xl bg-secondary/20 border border-border/30">
            <Avatar className="h-10 w-10 rounded-2xl border border-white/10 shadow-sm flex-shrink-0">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {user?.username?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate leading-tight">{user?.username || "Admin"}</p>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 mt-1 border border-green-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Online
              </span>
            </div>
          </div>

          {/* Quick Settings Bar */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Tema</span>
            <ToggleTheme />
          </div>

          {/* Logout Button */}
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full h-12 rounded-2xl gap-3 text-xs font-bold shadow-lg shadow-destructive/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <LogOut className="h-4 w-4" />
            Keluar dari Akun
          </Button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE TOP HEADER
          ========================================================= */}
      <header className="fixed top-0 inset-x-0 z-40 lg:hidden h-16 bg-background/60 backdrop-blur-2xl border-b border-border/45 flex items-center justify-between px-6 shadow-sm">
        {/* Mobile Branding */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-xl shadow-md shadow-primary/20">
            <Truck className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-base tracking-tight">
            Tracking<span className="text-primary">Truck</span>
          </span>
        </Link>

        {/* Action and Hamburger Drawer */}
        <div className="flex items-center gap-2">
          <ToggleTheme />
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-secondary/60 rounded-2xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-border/40 bg-card/95 backdrop-blur-3xl rounded-l-[32px] p-6 flex flex-col">
              <SheetHeader className="pb-8">
                <SheetTitle className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-primary rounded-2xl shadow-lg shadow-primary/25">
                    <Truck className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-base tracking-tight leading-none">Menu Navigasi</span>
                    <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-1">Admin Panel</span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Links */}
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4 text-sm font-bold rounded-2xl transition-all duration-300 relative group/mbtn",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary/40 text-muted-foreground"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                      )}
                      <link.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground/75")} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile User Profile and Logout */}
              <div className="mt-auto space-y-6 pt-6 border-t border-border/45">
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-secondary/30 border border-border/30">
                  <Avatar className="h-10 w-10 rounded-xl border border-white/10">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {user?.username?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate leading-tight">{user?.username || "Admin"}</p>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-green-500/10 text-green-500 mt-0.5">
                      Aktif
                    </span>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full h-14 rounded-2xl gap-3 text-xs font-bold shadow-lg shadow-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                  Keluar
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
