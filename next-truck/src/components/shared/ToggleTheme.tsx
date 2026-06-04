"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Terminal } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function ToggleTheme() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-xl border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/50 transition-all group relative overflow-hidden"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-primary" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-primary" />
          <span className="sr-only">Ganti tema</span>
          
          {/* Subtle corner marker */}
          <div className="absolute top-0 right-0 w-1 h-1 bg-primary/20" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-border bg-popover/90 backdrop-blur-lg">
        <DropdownMenuLabel className="font-display text-[10px] text-muted-foreground tracking-widest uppercase pb-2">Pilih Tema</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="rounded-lg mb-1 focus:bg-primary/10 focus:text-primary gap-3 py-2 cursor-pointer"
        >
          <div className="p-1.5 bg-secondary rounded-md"><Sun className="h-4 w-4" /></div>
          <span className="font-medium text-sm">Terang</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="rounded-lg mb-1 focus:bg-primary/10 focus:text-primary gap-3 py-2 cursor-pointer"
        >
          <div className="p-1.5 bg-secondary rounded-md"><Moon className="h-4 w-4" /></div>
          <span className="font-medium text-sm">Gelap</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="rounded-lg focus:bg-primary/10 focus:text-primary gap-3 py-2 cursor-pointer"
        >
          <div className="p-1.5 bg-secondary rounded-md"><Monitor className="h-4 w-4" /></div>
          <span className="font-medium text-sm">Otomatis</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border/50" />
        <div className="px-2 py-1.5 flex items-center justify-between text-[8px] font-mono text-muted-foreground/40 uppercase tracking-widest">
           <span>Otomatis</span>
           <Terminal className="h-3 w-3" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
