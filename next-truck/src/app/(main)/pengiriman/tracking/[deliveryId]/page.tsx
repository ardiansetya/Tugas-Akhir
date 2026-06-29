"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Navigation, RefreshCw, Database, Globe, Zap, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrackingPositions, useDelivery, useTrucks } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { BentoCard } from "@/components/shared/BentoCard";
import { cn } from "@/lib/utils";

// Dynamic import untuk komponen Map agar tidak di-render di server
const TrackingMap = dynamic(() => import("@/components/tracking/TrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-secondary/10 rounded-3xl flex items-center justify-center border-2 border-dashed">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary/20 border-t-primary mx-auto"></div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Menyiapkan Peta Lokasi...</p>
      </div>
    </div>
  ),
});

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const deliveryId = params.deliveryId as string;
  const queryClient = useQueryClient();

  const {
    data: trackingData,
    isLoading: loading,
    isFetching: fetching,
    refetch,
  } = useTrackingPositions(deliveryId);

  const { data: deliveryData } = useDelivery(deliveryId);
  const { data: trucks } = useTrucks();

  const truckPlate = useMemo(() => {
    if (!deliveryData || !trucks) return "";
    const tr = trucks.find((t) => t.id === deliveryData.truck_id);
    return tr ? tr.license_plate : "";
  }, [deliveryData, trucks]);

  const deliveryDateStr = useMemo(() => {
    if (!deliveryData?.started_at) return "";
    const date = new Date(deliveryData.started_at * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }, [deliveryData?.started_at]);

  const queryCache = queryClient.getQueryCache();
  const query = queryCache.find({ queryKey: ["tracking", deliveryId] });
  const lastUpdated = query?.state.dataUpdatedAt;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 0.1 ? timestamp * 1000 : Date.now()).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp * 1000;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}J YANG LALU`;
    return `${minutes}M YANG LALU`;
  };

  const positions = Array.isArray(trackingData) ? trackingData : [];
  const currentPosition = positions[0];

  const formatLastUpdated = () => {
    if (!lastUpdated) return "BELUM ADA DATA";
    const now = Date.now();
    const diff = Math.floor((now - lastUpdated) / 1000);
    
    if (diff < 5) return "BARU SAJA";
    if (diff < 60) return `${diff}D YANG LALU`;
    const minutes = Math.floor(diff / 60);
    return `${minutes}M YANG LALU`;
  };

  const exportToCSV = () => {
    if (positions.length === 0) return;

    const headers = ["No", "Nama Lokasi", "Alamat Lengkap", "Kota", "Provinsi", "Negara", "Latitude", "Longitude", "Waktu Rekam"];
    
    const rows = positions.map((pos: any, index: number) => {
      const waktu = new Date(pos.recorded_at * 1000).toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return [
        index + 1,
        `"${(pos.name || "-").replace(/"/g, '""')}"`,
        `"${(pos.formatted_address || "-").replace(/"/g, '""')}"`,
        `"${pos.city || "-"}"`,
        `"${pos.state || "-"}"`,
        `"${pos.country || "-"}"`,
        pos.latitude,
        pos.longitude,
        `"${waktu}"`,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    const cleanPlate = truckPlate ? truckPlate.replace(/\s+/g, "-") : "truk";
    const cleanDate = deliveryDateStr || "tanggal";
    link.download = `${cleanPlate}_${cleanDate}.csv`;

    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12 space-y-10">
      {/* Header Halaman */}
      <MotionWrapper className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/pengiriman")}
            className="h-14 w-14 rounded-2xl bg-secondary/50 hover:bg-secondary border text-muted-foreground hover:text-primary transition-all shadow-sm"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="space-y-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground/90 leading-tight">Lacak Lokasi Driver</h1>
            <div className="flex items-center gap-3">
               <p className="text-muted-foreground text-sm font-medium truncate">ID: {deliveryId}</p>
               <div className={cn(
                 "px-3 py-1 rounded-full text-[10px] font-bold animate-pulse",
                 fetching ? "bg-amber-500/10 text-amber-500" : "bg-green-500/10 text-green-600"
               )}>
                  {fetching ? "MEMUAT DATA..." : "ONLINE"}
               </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end gap-0.5 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
             <span>Pembaruan Terakhir</span>
             <span className="text-primary">{formatLastUpdated()}</span>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={exportToCSV}
            disabled={positions.length === 0}
            className="rounded-2xl h-14 px-8 font-bold gap-3 bg-secondary/30 hover:bg-secondary transition-all"
          >
            <Download className="h-5 w-5" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => refetch()}
            disabled={fetching}
            className="rounded-2xl h-14 px-8 font-bold gap-3 bg-secondary/30 hover:bg-secondary transition-all"
          >
            <RefreshCw className={cn("h-5 w-5", fetching && "animate-spin")} />
            Segarkan
          </Button>
        </div>
      </MotionWrapper>

      {/* Grid Konten Utama */}
      <div className="grid gap-10 lg:grid-cols-3">
        
        {/* Area Peta */}
        <div className="lg:col-span-2 space-y-6">
          <MotionWrapper delay={0.1}>
            <BentoCard 
              className="pb-0 overflow-hidden"
              title="Peta Lokasi" 
              subtitle="Posisi driver saat ini" 
              icon={<Globe className="h-5 w-5" />}
            >
              {loading ? (
                 <Skeleton className="w-full h-[650px] rounded-3xl" />
              ) : positions.length > 0 ? (
                 <TrackingMap positions={positions} deliveryData={deliveryData} />
              ) : (
                 <div className="w-full h-[650px] flex flex-col items-center justify-center p-12 text-center bg-secondary/5">
                    <div className="p-6 bg-background rounded-3xl mb-4 border shadow-sm">
                       <MapPin className="h-14 w-14 opacity-20" />
                    </div>
                    <h3 className="text-xl font-bold opacity-40">Koneksi Terputus</h3>
                    <p className="text-sm font-medium text-muted-foreground/40 mt-1 uppercase tracking-widest">GPS Mati</p>
                 </div>
              )}
            </BentoCard>
          </MotionWrapper>
        </div>

        {/* Area Info Sidebar */}
        <div className="space-y-10">
          <MotionWrapper delay={0.2}>
            <BentoCard title="Lokasi Sekarang" subtitle="Detail lokasi" icon={<Navigation className="h-5 w-5" />}>
               <div className="mt-4 space-y-8">
                 {loading ? (
                    <div className="space-y-6">
                       <Skeleton className="h-14 w-full rounded-2xl" />
                       <Skeleton className="h-4 w-3/4 rounded-lg" />
                       <Skeleton className="h-32 w-full rounded-2xl" />
                    </div>
                 ) : currentPosition ? (
                   <div className="space-y-8">
                      <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-3">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                            <Zap className="h-4 w-4" /> LOKASI DRIVER
                         </div>
                         <h4 className="text-xl font-bold leading-tight">{currentPosition.name}</h4>
                         <p className="text-xs font-medium text-muted-foreground/60 leading-relaxed">{currentPosition.formatted_address}</p>
                      </div>

                      <div className="space-y-4">
                         {[
                           { label: "Wilayah", value: `${currentPosition.city}, ${currentPosition.state}`, icon: Globe },
                           { label: "Waktu Update", value: formatDate(currentPosition.recorded_at), icon: Clock },
                         ].map((item, i) => (
                           <div key={i} className="flex flex-col gap-2 p-4 bg-secondary/10 rounded-2xl border">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                 <item.icon className="h-4 w-4" />
                                 {item.label}
                              </div>
                              <span className="text-sm font-bold truncate">{item.value}</span>
                           </div>
                         ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-secondary/5 rounded-2xl border text-center space-y-1">
                           <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">LINTANG</p>
                           <p className="text-sm font-bold">{currentPosition.latitude.toFixed(6)}</p>
                        </div>
                        <div className="p-4 bg-secondary/5 rounded-2xl border text-center space-y-1">
                           <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">BUJUR</p>
                           <p className="text-sm font-bold">{currentPosition.longitude.toFixed(6)}</p>
                        </div>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center py-24 px-6 border-2 border-dashed rounded-3xl bg-secondary/5 space-y-2">
                      <p className="text-lg font-bold opacity-20">TIDAK ADA DATA</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-20">Offline</p>
                   </div>
                 )}
               </div>
            </BentoCard>
          </MotionWrapper>


        </div>
      </div>

      {/* Riwayat Linimasa */}
      {positions.length > 0 && (
        <MotionWrapper delay={0.4}>
          <BentoCard title="Riwayat Lokasi" subtitle="Daftar lokasi yang dilewati" icon={<Database className="h-5 w-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
              {positions.map((position, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col gap-6 p-6 rounded-3xl border transition-all relative group",
                    index === 0
                      ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5"
                      : "bg-secondary/10 border-border/40 hover:border-primary/20"
                  )}
                >
                  {index === 0 && (
                     <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-pulse">
                        Posisi Sekarang
                     </div>
                  )}
                  
                  <div className="flex items-start gap-5">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 transition-transform group-hover:scale-110",
                      index === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border"
                    )}>
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h4 className="font-bold text-base tracking-tight truncate group-hover:text-primary transition-colors">
                        {position.name}
                      </h4>
                      <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest truncate">
                        {position.city}, {position.state}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-dashed border-border/50 flex items-center justify-between text-[11px] font-bold tracking-widest">
                     <span className="text-muted-foreground/30">{formatDate(position.recorded_at)}</span>
                     <span className="text-primary/60">{formatTimeAgo(position.recorded_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </MotionWrapper>
      )}
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/5 to-transparent pt-12" />
    </div>
  );
}
