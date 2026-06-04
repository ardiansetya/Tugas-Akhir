"use client";

import { useHistoryDeliveries, useRoute, useTruck, useUser } from "@/hooks";
import { MapPin, Search, Truck as TruckIcon, User, Clock, CheckCircle, Database, Archive, ArrowUpRight, Filter } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { BentoCard } from "@/components/shared/BentoCard";

// Komponen untuk menampilkan detail rute
function RouteDetail({ routeId }: { routeId: string }) {
  const { data: route } = useRoute(routeId);
  if (!route) return <span className="text-[10px] font-bold text-muted-foreground/40 uppercase">TITIK_{routeId.slice(0,8)}</span>;
  return (
    <span className="text-sm font-bold tracking-tight text-foreground/80">
      {route.start_city_name} <span className="text-muted-foreground/40 mx-1">→</span> {route.end_city_name}
    </span>
  );
}

// Komponen untuk menampilkan detail truk
function TruckDetail({ truckId }: { truckId: string }) {
  const { data: truck } = useTruck(truckId);
  return (
    <span className="text-xs font-bold text-foreground/70">
      {truck?.license_plate || truckId}
    </span>
  );
}

// Komponen untuk menampilkan detail sopir
function DriverDetail({ driverId }: { driverId: string }) {
  const { data: driver } = useUser(driverId);
  return (
    <span className="text-xs font-bold text-foreground/70">{driver?.username || "N/A"}</span>
  );
}

export default function HistoryPage() {
  const { data: historyData, isLoading: loading } = useHistoryDeliveries();
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (startedAt: number, finishedAt: number) => {
    const diff = finishedAt - startedAt;
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    return `${hours}J ${minutes}M`;
  };

  const filteredData = useMemo(() => {
    if (!historyData) return [];
    return historyData.filter((item) => {
      const q = searchQuery.toLowerCase();
      return item.id.toLowerCase().includes(q) ||
             item.truck_id.toLowerCase().includes(q) ||
             item.route_id.toLowerCase().includes(q) ||
             item.worker_id.toLowerCase().includes(q);
    });
  }, [historyData, searchQuery]);

  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12 space-y-10">
      {/* Header Halaman */}
      <MotionWrapper className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/90">
            Arsip Pemenuhan
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Tinjau misi yang telah selesai dan catatan historis operasional.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pengiriman">
            <Button variant="ghost" className="rounded-2xl font-bold text-xs gap-2 bg-secondary/50 hover:bg-secondary border shadow-sm">
              <TruckIcon className="h-4 w-4" />
              Aliran Aktif
            </Button>
          </Link>
        </div>
      </MotionWrapper>

      {/* Bento Grid Pencarian & Analitik */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <MotionWrapper className="lg:col-span-2">
           <BentoCard title="Kueri Arsip" subtitle="CARI_BERDASARKAN_ID_ATAU_PARAMETER" icon={<Search className="h-5 w-5" />}>
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Masukkan ID, Unit, atau Sopir..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 h-14 rounded-2xl border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold transition-all"
                />
              </div>
           </BentoCard>
        </MotionWrapper>

        <BentoCard title="Total Catatan" subtitle="JUMLAH_TERAGREGASI" icon={<Database className="h-5 w-5" />} delay={0.1}>
           <div className="text-4xl font-bold">{historyData?.length || 0}</div>
        </BentoCard>

        <BentoCard title="Hasil Kueri" subtitle="HASIL_TERFILTER" icon={<Filter className="h-5 w-5" />} delay={0.2}>
           <div className="text-4xl font-bold text-primary">{filteredData.length}</div>
        </BentoCard>
      </div>

      {/* Arus Riwayat */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
            Catatan Historis ({filteredData.length})
          </span>
          <div className="h-[1px] flex-1 bg-border/40" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="h-14 w-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Mengambil dataset arsip...</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {filteredData.map((item, index) => (
              <MotionWrapper key={item.id} delay={index * 0.05 + 0.3}>
                <Link href={`/pengiriman/${item.id}`}>
                   <BentoCard 
                     className="hover:border-primary/40 transition-all cursor-pointer group"
                   >
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-[10px] font-bold text-green-600">
                             <CheckCircle className="h-3.5 w-3.5" /> SELESAI
                           </div>
                           <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60">
                              <Clock className="h-4 w-4" />
                              {item.finished_at && calculateDuration(item.started_at, item.finished_at)}
                           </div>
                        </div>

                        <div className="p-5 bg-secondary/10 rounded-2xl border border-border/30 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                           <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-2">
                              <MapPin className="h-3.5 w-3.5" /> Rute Misi
                           </div>
                           <RouteDetail routeId={item.route_id} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-secondary/5 rounded-2xl border">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/30 uppercase mb-2">
                                 <TruckIcon className="h-3.5 w-3.5" /> Unit Utama
                              </div>
                              <TruckDetail truckId={item.truck_id} />
                           </div>
                           <div className="p-4 bg-secondary/5 rounded-2xl border">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/30 uppercase mb-2">
                                 <User className="h-3.5 w-3.5" /> Operator Utama
                              </div>
                              <DriverDetail driverId={item.worker_id} />
                           </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-muted-foreground/40">
                           <span>Selesai: {formatDate(item.finished_at * 1000)}</span>
                           <div className="flex items-center gap-1 text-primary scale-0 group-hover:scale-100 transition-all">
                              <span className="text-[10px] font-bold uppercase tracking-widest">Detail</span>
                              <ArrowUpRight className="h-4 w-4" />
                           </div>
                        </div>
                     </div>
                   </BentoCard>
                </Link>
              </MotionWrapper>
            ))}
          </div>
        )}
      </div>

      {/* Tampilan Kosong */}
      {!loading && filteredData.length === 0 && (
         <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
            <div className="p-6 bg-secondary/30 rounded-full border border-border/50">
               <Archive className="h-12 w-12 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
               <h3 className="text-xl font-bold">Tidak ada catatan ditemukan</h3>
               <p className="text-sm font-medium text-muted-foreground/60 max-w-xs mx-auto">Tidak ada misi yang sesuai dengan parameter pencarian Anda di dalam arsip.</p>
            </div>
         </div>
      )}
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/5 to-transparent pt-12" />
    </div>
  );
}

import { Button } from "@/components/ui/button";
