"use client";

import { useDeliveriesActive, useRoutes, useTransits, useTrucks } from "@/hooks";
import { ClipboardCheck, Package, Route, Truck, Globe, ArrowUpRight, Activity, TrendingUp } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: routes, isLoading: routesLoading } = useRoutes();
  const { data: trucks, isLoading: trucksLoading } = useTrucks();
  const { data: deliveries, isLoading: deliveriesLoading } = useDeliveriesActive();
  const { data: transits, isLoading: transitsLoading } = useTransits();

  const totalRoutes = routes?.length || 0;
  const totalTrucksActive = trucks?.filter((t) => t.is_available)?.length || 0;
  const totalDeliveries = deliveries?.length || 0;
  const totalTransitsPending = transits?.filter((t) => t.is_accepted === null && !t.actioned_at)?.length || 0;

  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12 space-y-10">
      {/* Page Header */}
      <MotionWrapper className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/90">
          Beranda
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Pantau semua aktivitas pengiriman dan armada Anda.
        </p>
      </MotionWrapper>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Core Metrics */}
        <BentoCard
          title="Rute Aktif"
          subtitle="Jumlah rute"
          icon={<Route className="h-5 w-5" />}
          delay={0.1}
        >
          <div className="flex items-end justify-between">
            <div className="text-4xl font-bold">{routesLoading ? "..." : totalRoutes}</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="h-3 w-3" />
              STABIL
            </div>
          </div>
        </BentoCard>

        <BentoCard
          title="Truk Tersedia"
          subtitle="Siap pakai"
          icon={<Truck className="h-5 w-5" />}
          delay={0.2}
        >
          <div className="flex items-end justify-between">
            <div className="text-4xl font-bold">{trucksLoading ? "..." : totalTrucksActive}</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {trucks?.length || 0} TOTAL
            </div>
          </div>
        </BentoCard>

        <BentoCard
          title="Pengiriman Aktif"
          subtitle="Sedang berjalan"
          icon={<Package className="h-5 w-5" />}
          delay={0.3}
        >
          <div className="flex items-end justify-between">
            <div className="text-4xl font-bold">{deliveriesLoading ? "..." : totalDeliveries}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              SEDANG KIRIM
            </div>
          </div>
        </BentoCard>

        <BentoCard
          title="Perlu Persetujuan"
          subtitle="Menunggu konfirmasi"
          icon={<ClipboardCheck className="h-5 w-5" />}
          delay={0.4}
        >
          <div className="flex items-end justify-between">
            <div className="text-4xl font-bold">{transitsLoading ? "..." : totalTransitsPending}</div>
            <div className={cn(
               "px-2 py-0.5 rounded-full text-[10px] font-bold",
               totalTransitsPending > 0 ? "bg-amber-500/10 text-amber-500" : "bg-green-500/10 text-green-500"
            )}>
              {totalTransitsPending > 0 ? "PERLU TINDAKAN" : "SEMUA BERES"}
            </div>
          </div>
        </BentoCard>

        {/* Major Grid Sections */}
        <BentoCard
          title="Aktivitas Terbaru"
          subtitle="Info terkini"
          icon={<Globe className="h-5 w-5" />}
          className="md:col-span-2 lg:col-span-3 lg:row-span-2"
          delay={0.5}
        >
          <div className="mt-6 space-y-6">
            {[
              { id: "TX-4229", status: "Sampai di Pos A", time: "2 mnt lalu", type: "arrival" },
              { id: "TX-8812", status: "Berangkat ke Rute X", time: "12 mnt lalu", type: "departure" },
              { id: "TX-9031", status: "Sudah Disetujui", time: "45 mnt lalu", type: "auth" },
              { id: "TX-1102", status: "Barang Dimuat", time: "1 jam lalu", type: "cargo" },
              { id: "TX-5521", status: "Rute Dialihkan", time: "2 jam lalu", type: "alert" },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-4 group cursor-default">
                <div className="relative pt-1 flex flex-col items-center">
                   <div className={cn(
                     "h-2 w-2 rounded-full ring-4 ring-background z-10",
                     i === 0 ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                   )} />
                   {i !== 4 && <div className="w-[1px] h-12 bg-border mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                   <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-foreground/80">{log.id}</span>
                    <span className="text-[10px] font-medium text-muted-foreground">{log.time}</span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
                    {log.status}
                  </p>
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-2xl bg-secondary/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
              Lihat Selengkapnya
            </button>
          </div>
        </BentoCard>

        {/* Efficiency Section */}
        <BentoCard
          title="Pemakaian Truk"
          subtitle="Tingkat pemakaian"
          icon={<Activity className="h-5 w-5" />}
          className="lg:col-span-1"
          delay={0.6}
        >
          <div className="mt-4 space-y-6">
            <div className="flex flex-col items-center justify-center py-6">
               <div className="relative h-24 w-24">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path
                      className="stroke-secondary fill-none"
                      strokeWidth="3"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="stroke-primary fill-none transition-all duration-1000"
                      strokeWidth="3"
                      strokeDasharray={`${(totalTrucksActive / (trucks?.length || 1)) * 100}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold">{Math.round((totalTrucksActive / (trucks?.length || 1)) * 100)}%</span>
                  </div>
               </div>
            </div>
            
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground/60">
                 <span>Dipakai</span>
                 <span>{totalTrucksActive} Unit</span>
               </div>
               <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(totalTrucksActive / (trucks?.length || 1)) * 100}%` }} />
               </div>
            </div>
          </div>
        </BentoCard>

        {/* Quick Action Section */}
        <BentoCard
          className="bg-primary text-primary-foreground lg:col-span-1"
          delay={0.7}
        >
          <div className="flex flex-col h-full justify-between">
            <div className="p-3 bg-white/20 w-fit rounded-2xl">
               <ArrowUpRight className="h-6 w-6" />
            </div>
            <div className="mt-8">
               <h3 className="text-xl font-bold leading-tight">Persetujuan Transit</h3>
               <p className="text-xs opacity-70 mt-2 font-medium">Setujui atau tolak permintaan transit dari driver.</p>
               <button className="mt-6 w-full py-3 bg-white text-primary rounded-2xl text-xs font-bold hover:bg-white/90 transition-all">
                 Buka Halaman Transit
               </button>
            </div>
          </div>
        </BentoCard>
        
      </div>

    </div>
  );
}
