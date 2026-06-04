"use client";

import { Button } from "@/components/ui/button";
import { Search, Terminal, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { TechCard } from "@/components/shared/TechCard";

interface TruckSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: "all" | "available" | "unavailable";
  setSelectedFilter: (filter: "all" | "available" | "unavailable") => void;
  selectedCargoType: string;
  setSelectedCargoType: (type: string) => void;
  cargoTypes: string[];
}

export default function TruckSearchFilter({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  selectedCargoType,
  setSelectedCargoType,
  cargoTypes,
}: TruckSearchFilterProps) {
  return (
    <TechCard title="Filter Pencarian" subtitle="Modul Filter Armada" icon={<Terminal className="h-4 w-4" />}>
      <div className="space-y-6 pt-2">
        {/* Search & Status Filters */}
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="relative flex-1 group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-4 w-4" />
              <div className="w-[1px] h-4 bg-border/50" />
            </div>
            <input
              type="text"
              placeholder="Cari ID, Plat Nomor, atau Model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-11 rounded-xl border border-border/50 bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 font-mono text-sm tracking-tight transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest pointer-events-none">
              CTRL + K
            </div>
          </div>

          <div className="flex p-1 bg-secondary/30 rounded-xl border border-border/40 w-fit">
            {[
              { id: "all", label: "Semua Unit" },
              { id: "available", label: "Siap Pakai" },
              { id: "unavailable", label: "Dalam Servis" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={cn(
                  "px-4 py-2 text-[10px] font-display uppercase tracking-widest rounded-lg transition-all",
                  selectedFilter === f.id
                    ? "bg-background text-primary shadow-sm border border-border/50 font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cargo Type Filter */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 py-4 px-4 bg-secondary/10 rounded-xl border border-dashed border-border/60">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-muted-foreground/80 uppercase tracking-[0.2em]">
            <Cpu className="h-3 w-3 text-primary" />
            Spesifikasi Kargo:
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {cargoTypes.map((type) => (
              <Button
                key={type}
                variant={selectedCargoType === type ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 px-3 text-[10px] uppercase font-mono tracking-widest border-border/50",
                  selectedCargoType === type 
                    ? "shadow-lg shadow-primary/10" 
                    : "bg-transparent text-muted-foreground hover:bg-secondary/50"
                )}
                onClick={() => setSelectedCargoType(type)}
              >
                {type === "all" ? "SEMUA JENIS" : type}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </TechCard>
  );
}
