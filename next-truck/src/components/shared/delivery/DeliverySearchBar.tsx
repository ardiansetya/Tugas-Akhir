import { Search, Terminal } from "lucide-react";
import { TechCard } from "@/components/shared/TechCard";

interface DeliverySearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function DeliverySearchBar({
  searchQuery,
  setSearchQuery,
}: DeliverySearchBarProps) {
  return (
    <TechCard title="Filter Pengiriman" subtitle="Modul Pencarian Jaringan" icon={<Terminal className="h-4 w-4" />}>
      <div className="relative group pt-2">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="h-4 w-4" />
          <div className="w-[1px] h-4 bg-border/50" />
        </div>
        <input
          type="text"
          placeholder="Cari berdasarkan ID Truk atau Jalur Rute..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 h-12 rounded-xl border border-border/50 bg-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 font-mono text-sm tracking-tighter transition-all placeholder:text-muted-foreground/40"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground/20 uppercase tracking-[0.2em] pointer-events-none hidden sm:block">
          Siap Input
        </div>
      </div>
    </TechCard>
  );
}
