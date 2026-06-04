"use client";

import { Search, Terminal, Filter } from "lucide-react";
import { TechCard } from "@/components/shared/TechCard";
import { cn } from "@/lib/utils";

interface TransitDriverSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: "all" | "pending" | "accepted" | "rejected";
  setSelectedStatus: (
    status: "all" | "pending" | "accepted" | "rejected"
  ) => void;
}

export default function TransitDriverSearchFilter({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
}: TransitDriverSearchFilterProps) {
  return (
    <TechCard title="Pencarian" subtitle="Cari data transit" icon={<Terminal className="h-4 w-4" />}>
      <div className="space-y-6 pt-2">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="relative flex-1 group">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-4 w-4" />
              <div className="w-[1px] h-4 bg-border/50" />
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan ID Transit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-11 rounded-xl border border-border/50 bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 font-mono text-sm tracking-tighter transition-all"
            />
          </div>

          <div className="flex p-1 bg-secondary/30 rounded-xl border border-border/40 w-fit overflow-x-auto">
            {[
              { id: "all", label: "Semua" },
              { id: "pending", label: "Menunggu" },
              { id: "accepted", label: "Disetujui" },
              { id: "rejected", label: "Ditolak" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStatus(s.id as any)}
                className={cn(
                  "px-4 py-2 text-[9px] font-display uppercase tracking-widest rounded-lg transition-all whitespace-nowrap",
                  selectedStatus === s.id
                    ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[8px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
           <Filter className="h-3 w-3" />
           Filter Aktif: {selectedStatus === "all" ? "Semua" : selectedStatus === "pending" ? "Menunggu" : selectedStatus === "accepted" ? "Disetujui" : "Ditolak"} | Pencarian: {searchQuery ? "Aktif" : "Kosong"}
        </div>
      </div>
    </TechCard>
  );
}
