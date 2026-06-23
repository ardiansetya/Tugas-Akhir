"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Package, Search, Terminal, Columns, Filter } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { RouteData } from "@/types/api";
import { TechCard } from "@/components/shared/TechCard";
import { cn } from "@/lib/utils";

interface RouteFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: "all" | "active" | "inactive";
  setSelectedStatus: (status: "all" | "active" | "inactive") => void;
  selectedCargoType: string;
  setSelectedCargoType: (type: string) => void;
  cargoTypes: string[];
  table: Table<RouteData>;
}

export default function RouteFilters({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedCargoType,
  setSelectedCargoType,
  cargoTypes,
  table,
}: RouteFiltersProps) {
  return (
    <TechCard title="Filter Rute" subtitle="Pencarian Jalur Jaringan" icon={<Terminal className="h-4 w-4" />}>
      <div className="space-y-6 pt-2">
        {/* Search & Column Visibility */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-4 w-4" />
              <div className="w-[1px] h-4 bg-border/50" />
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan Kota Asal, Tujuan, atau Tipe Kargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-11 rounded-xl border border-border/50 bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 font-mono text-sm tracking-tighter transition-all"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 px-6 rounded-xl border-border/50 bg-secondary/10 hover:bg-secondary/30 gap-2 font-mono text-[10px] uppercase tracking-widest transition-all">
                <Columns className="h-4 w-4" />
                Konfigurasi Tabel
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border bg-popover/90 backdrop-blur-xl">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize rounded-lg mb-1 focus:bg-primary/10 focus:text-primary"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id.replace(/_/g, " ")}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status & Cargo Type Filters */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 py-3 px-4 bg-secondary/10 rounded-xl border border-border/40">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-muted-foreground/80 uppercase tracking-[0.2em]">
              <Filter className="h-3 w-3 text-primary" />
              Status Jalur:
            </div>
            <div className="flex p-1 bg-background/50 rounded-lg border border-border/30">
              {[
                { id: "all", label: "Semua" },
                { id: "active", label: "Aktif" },
                { id: "inactive", label: "Tidak Aktif" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-[9px] font-display uppercase tracking-widest rounded-md transition-all",
                    selectedStatus === s.id
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 py-3 px-4 bg-secondary/10 rounded-xl border border-border/40">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-muted-foreground/80 uppercase tracking-[0.2em]">
              <Package className="h-3 w-3 text-primary" />
              Muatan Kargo:
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {cargoTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedCargoType === type ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-[9px] uppercase font-mono tracking-widest border-border/50",
                    selectedCargoType === type 
                      ? "shadow-md shadow-primary/10 font-bold" 
                      : "bg-transparent text-muted-foreground hover:bg-secondary/50"
                  )}
                  onClick={() => setSelectedCargoType(type)}
                >
                  {type === "all" ? "Semua" : type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TechCard>
  );
}
