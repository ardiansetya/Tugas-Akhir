"use client";

import {
  useDeliveriesActive,
  useRoutes,
  useTransits,
  useTrucks,
  useHistoryDeliveries,
  useRecentAlerts,
  useTransitPoints,
  useCities,
} from "@/hooks";
import { ClipboardCheck, Package, Route, Truck, Globe, ArrowUpRight, Activity, TrendingUp } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function Home() {
  const { data: routes, isLoading: routesLoading } = useRoutes();
  const { data: trucks, isLoading: trucksLoading } = useTrucks();
  const { data: deliveries, isLoading: deliveriesLoading } = useDeliveriesActive();
  const { data: transits, isLoading: transitsLoading } = useTransits();
  const { data: historyDeliveries } = useHistoryDeliveries();
  const { data: alerts } = useRecentAlerts();
  const { data: transitPoints } = useTransitPoints();
  const { data: cities } = useCities();

  const totalRoutes = routes?.length || 0;
  
  // Get unique truck IDs currently in active deliveries
  const activeTruckIds = useMemo(() => {
    return new Set(deliveries?.map((d) => d.truck_id) || []);
  }, [deliveries]);

  // Available trucks = operational (is_available) and NOT in active delivery
  const totalTrucksAvailable = useMemo(() => {
    return trucks?.filter((t) => t.is_available && !activeTruckIds.has(t.id))?.length || 0;
  }, [trucks, activeTruckIds]);

  const totalTrucksInUse = activeTruckIds.size;
  const totalTrucks = trucks?.length || 0;
  const truckUsagePercentage = totalTrucks > 0 ? Math.round((totalTrucksInUse / totalTrucks) * 100) : 0;

  const totalDeliveries = deliveries?.length || 0;
  const totalTransitsPending = transits?.filter((t) => t.is_accepted === null && !t.actioned_at)?.length || 0;

  const formatTimeAgo = (timestampInSeconds: number) => {
    const diff = Date.now() - timestampInSeconds * 1000;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (days > 0) return `${days} Hari lalu`;
    if (hours > 0) return `${hours} Jam lalu`;
    if (minutes > 0) return `${minutes} Menit lalu`;
    return "Baru saja";
  };

  const activityLogs = useMemo(() => {
    const logs: Array<{
      id: string;
      plateNumber: string;
      status: string;
      time: string;
      timestamp: number;
      type: "arrival" | "departure" | "auth" | "cargo" | "alert";
    }> = [];

    const getTruckPlate = (truckId?: string) => {
      if (!truckId || !trucks) return "Truk";
      const tr = trucks.find((t) => t.id === truckId);
      return tr ? tr.license_plate : truckId;
    };

    const getRouteCities = (routeId?: string) => {
      if (!routeId || !routes) return "";
      const r = routes.find((route) => route.id === routeId);
      return r ? ` (Rute ${r.start_city_name} → ${r.end_city_name})` : "";
    };

    const translateAlertType = (type: string) => {
      switch (type.toUpperCase()) {
        case "GPS_LOST": return "GPS Hilang";
        case "ILLEGAL_STOP": return "Berhenti Ilegal";
        case "TRAFFIC": return "Macet";
        case "ACCIDENT": return "Kecelakaan";
        case "BREAKDOWN": return "Mogok";
        case "ROUTE_DEVIATION": return "Menyimpang Rute";
        case "PUNCTURE": return "Ban Bocor/Pecah";
        case "FUEL_ISSUE": return "Masalah BBM";
        case "UNAUTHORIZED_UNLOADING": return "Bongkar Ilegal";
        case "CANCELED": return "Dibatalkan";
        default: return type;
      }
    };

    // 1. Active Deliveries (Started)
    if (deliveries) {
      deliveries.forEach((d) => {
        logs.push({
          id: d.id,
          plateNumber: getTruckPlate(d.truck_id),
          status: `Pengiriman dimulai${getRouteCities(d.route_id)}`,
          timestamp: d.started_at,
          type: "departure",
          time: formatTimeAgo(d.started_at),
        });
      });
    }

    // 2. History Deliveries (Started & Finished)
    if (historyDeliveries) {
      historyDeliveries.forEach((d) => {
        const plate = getTruckPlate(d.truck_id);
        const routeText = getRouteCities(d.route_id);
        if (d.finished_at) {
          logs.push({
            id: d.id,
            plateNumber: plate,
            status: `Pengiriman selesai${routeText}`,
            timestamp: d.finished_at,
            type: "arrival",
            time: formatTimeAgo(d.finished_at),
          });
        }
        logs.push({
          id: d.id,
          plateNumber: plate,
          status: `Pengiriman dimulai${routeText}`,
          timestamp: d.started_at,
          type: "departure",
          time: formatTimeAgo(d.started_at),
        });
      });
    }

    // 3. Transits
    if (transits) {
      transits.forEach((t) => {
        const del = deliveries?.find((d) => d.id === t.delivery_id) || historyDeliveries?.find((d) => d.id === t.delivery_id);
        const plate = getTruckPlate(del?.truck_id);

        let pathStr = `#${t.transit_point_id}`;
        if (transitPoints && cities) {
          const tp = transitPoints.find((point) => point.id === t.transit_point_id);
          if (tp) {
            const loadingCity = cities.find((c) => c.id === tp.loading_city_id);
            const unloadingCity = cities.find((c) => c.id === tp.unloading_city_id);
            if (loadingCity && unloadingCity) {
              pathStr = `${loadingCity.name} → ${unloadingCity.name}`;
            }
          }
        }

        if (t.arrived_at) {
          logs.push({
            id: t.delivery_id,
            plateNumber: plate,
            status: `Driver mengajukan Transit (${pathStr})${t.is_accepted === null && !t.actioned_at ? " [Perlu Tindakan]" : ""}`,
            timestamp: t.arrived_at,
            type: "cargo",
            time: formatTimeAgo(t.arrived_at),
          });
        }

        if (t.actioned_at && t.is_accepted !== null) {
          logs.push({
            id: t.delivery_id,
            plateNumber: plate,
            status: `Persetujuan Transit (${pathStr}): ${t.is_accepted ? "Disetujui" : "Ditolak"}${t.reason ? ` (${t.reason})` : ""}`,
            timestamp: t.actioned_at,
            type: t.is_accepted ? "auth" : "alert",
            time: formatTimeAgo(t.actioned_at),
          });
        }
      });
    }

    // 4. Alerts
    if (alerts) {
      alerts.forEach((a) => {
        const del = deliveries?.find((d) => d.id === a.delivery_id) || historyDeliveries?.find((d) => d.id === a.delivery_id);
        const plate = getTruckPlate(del?.truck_id);
        const firstLine = a.message ? a.message.split("\n")[0] : "";

        logs.push({
          id: a.delivery_id || "ALERT",
          plateNumber: plate,
          status: `Peringatan: ${translateAlertType(a.type)} - ${firstLine}`,
          timestamp: a.created_at,
          type: "alert",
          time: formatTimeAgo(a.created_at),
        });
      });
    }

    // Sort by timestamp descending
    logs.sort((a, b) => b.timestamp - a.timestamp);

    // Deduplicate identical events on same delivery at same second
    const uniqueLogs: typeof logs = [];
    const seen = new Set<string>();
    for (const log of logs) {
      const key = `${log.id}-${log.status}-${log.timestamp}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLogs.push(log);
      }
    }

    return uniqueLogs.slice(0, 5);
  }, [deliveries, historyDeliveries, transits, transitPoints, cities, alerts, trucks, routes]);

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
            <div className="text-4xl font-bold">{trucksLoading ? "..." : totalTrucksAvailable}</div>
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
            {activityLogs.length === 0 ? (
              <div className="text-center py-8 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                Tidak Ada Aktivitas Baru
              </div>
            ) : (
              activityLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-4 group cursor-default">
                  <div className="relative pt-1 flex flex-col items-center">
                     <div className={cn(
                       "h-2 w-2 rounded-full ring-4 ring-background z-10",
                       log.type === "alert" ? "bg-destructive animate-pulse" :
                       i === 0 ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                     )} />
                     {i !== activityLogs.length - 1 && <div className="w-[1px] h-12 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                     <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground/80">{log.plateNumber}</span>
                      <span className="text-[10px] font-medium text-muted-foreground">{log.time}</span>
                    </div>
                    <p className={cn(
                      "text-sm font-medium transition-colors cursor-pointer",
                      log.type === "alert" ? "text-destructive font-semibold" : "text-muted-foreground group-hover:text-primary"
                    )}>
                      {log.status}
                    </p>
                  </div>
                </div>
              ))
            )}
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
                      strokeDasharray={`${truckUsagePercentage}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold">{truckUsagePercentage}%</span>
                  </div>
               </div>
            </div>
            
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground/60">
                 <span>Dipakai</span>
                 <span>{totalTrucksInUse} Unit</span>
               </div>
               <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${truckUsagePercentage}%` }} />
               </div>
            </div>
          </div>
        </BentoCard>

        {/* Quick Action Section */}
        <BentoCard
          className="bg-primary text-primary-foreground hover:bg-primary lg:col-span-1"
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
