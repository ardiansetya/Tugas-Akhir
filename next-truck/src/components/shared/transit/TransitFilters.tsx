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
import { TechCard } from "@/components/shared/TechCard";
import { cn } from "@/lib/utils";

interface TransitFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterActive: "all" | "active" | "inactive";
  setFilterActive: (status: "all" | "active" | "inactive") => void;
  filterCargoType: string;
  setFilterCargoType: (type: string) => void;
  cargoTypes: string[];
  table: Table<any>;
}

export default function TransitFilters({
  searchQuery,
  setSearchQuery,
  filterActive,
  setFilterActive,
  filterCargoType,
  setFilterCargoType,
  cargoTypes,
  table,
}: TransitFiltersProps) {
  return (
    <TechCard title="Status Serah Terima" subtitle="Pencarian Lokasi Transit" icon={<Terminal className="h-4 w-4" />}>
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
              placeholder="Cari berdasarkan ID Titik, Kelas Kargo, atau Lokasi..."
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
              Ketersediaan Pos:
            </div>
            <div className="flex p-1 bg-background/50 rounded-lg border border-border/30">
              {[
                { id: "all", label: "SEMUA DATA" },
                { id: "active", label: "Daring" },
                { id: "inactive", label: "Luring" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFilterActive(s.id as any)}
                  className={cn(
                    "px-4 py-1.5 text-[9px] font-display uppercase tracking-widest rounded-md transition-all",
                    filterActive === s.id
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
              Kelas Transfer:
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={filterCargoType === "all" ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-7 px-3 text-[9px] uppercase font-mono tracking-widest border-border/50",
                  filterCargoType === "all" 
                    ? "shadow-md shadow-primary/10 font-bold" 
                    : "bg-transparent text-muted-foreground hover:bg-secondary/50"
                )}
                onClick={() => setFilterCargoType("all")}
              >
                SEMUA DATA
              </Button>
              {cargoTypes.map((type) => (
                <Button
                  key={type}
                  variant={filterCargoType === type ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-[9px] uppercase font-mono tracking-widest border-border/50",
                    filterCargoType === type 
                      ? "shadow-md shadow-primary/10 font-bold" 
                      : "bg-transparent text-muted-foreground hover:bg-secondary/50"
                  )}
                  onClick={() => setFilterCargoType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TechCard>
  );
}
