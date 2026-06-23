"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DeliveryHeader } from "@/components/shared/delivery-detail/DeliveryHeader";
import { DeliveryStatusCards } from "@/components/shared/delivery-detail/DeliveryStatusCard";
import { DeliveryTransitList } from "@/components/shared/delivery-detail/DeliveryTransitsList";
import DeliveryPaymentCard from "@/components/shared/delivery-detail/DeliveryPaymentCard";
import { DeliveryInfoSection } from "@/components/shared/delivery-detail/DeliveryInfoSection";
import { useDelivery } from "@/hooks/useDelivery";
import { useRoute } from "@/hooks/useRoute";
import { DeliveryDetailData, RouteData } from "@/types/api";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { Activity, Globe, MonitorCheck } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";

export default function DeliveryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: deliveryData, isLoading } = useDelivery(id);
  const delivery = deliveryData as DeliveryDetailData | undefined;

  const { data: routeData } = useRoute(delivery?.route_id ?? "");
  const route = routeData as RouteData | undefined;

  // ✅ Utility Formatters
  const formatDateTime = (timestamp: number): string =>
    new Date(timestamp).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const formatDate = (timestamp: number): string =>
    new Date(timestamp).toLocaleDateString("id-ID", { dateStyle: "medium" });

  const formatTime = (timestamp: number): string =>
    new Date(timestamp).toLocaleTimeString("id-ID", { timeStyle: "short" });

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  const calculateDuration = (start: number, end?: number): string => {
    const startMs = start * 1000;
    const endMs = end ? end * 1000 : Date.now();
    const diffMs = endMs - startMs;
    if (diffMs <= 0) return "0 Menit";
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      if (remainingHours > 0 && minutes > 0) return `${days} Hari ${remainingHours} Jam ${minutes} Menit`;
      if (remainingHours > 0) return `${days} Hari ${remainingHours} Jam`;
      if (minutes > 0) return `${days} Hari ${minutes} Menit`;
      return `${days} Hari`;
    }
    
    if (hours > 0 && minutes > 0) return `${hours} Jam ${minutes} Menit`;
    if (hours > 0) return `${hours} Jam`;
    return `${minutes} Menit`;
  };

  if (isLoading || !delivery) {
    return (
      <div className="container mx-auto p-6 md:p-10 lg:p-12 space-y-10">
        <div className="flex items-center gap-6">
           <Skeleton className="h-16 w-16 rounded-3xl" />
           <div className="space-y-3">
              <Skeleton className="h-10 w-80 rounded-xl" />
              <Skeleton className="h-5 w-60 rounded-lg" />
           </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Skeleton className="lg:col-span-2 h-[600px] rounded-3xl" />
          <Skeleton className="h-[600px] rounded-3xl" />
        </div>
      </div>
    );
  }

  const duration = calculateDuration(delivery.started_at, delivery.finished_at);
  const acceptedTransits = delivery.transits.filter(
    (t) => t.is_accepted === true
  ).length;
  const totalTransits = delivery.transits.length;
  const isFinished = !!delivery.finished_at;

  const totalPrice =
    (route?.base_price ?? 0) +
    delivery.transits.reduce(
      (sum, transit) => sum + (transit.transit_point.extra_cost ?? 0),
      0
    );

  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12 space-y-10">
      {/* Header Area */}
      <MotionWrapper>
        <DeliveryHeader delivery={delivery} />
      </MotionWrapper>

      {/* Primary Metrics */}
      <DeliveryStatusCards
        delivery={delivery}
        duration={duration}
        acceptedTransits={acceptedTransits}
        totalTransits={totalTransits}
        formatDate={formatDate}
        formatTime={formatTime}
      />

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content Info */}
        <div className="lg:col-span-2 space-y-10">
          <DeliveryInfoSection
            deliveryId={delivery.id}
            routeId={delivery.route_id}
            truckId={delivery.truck_id}
            driverId={delivery.worker_id}
            operatorId={delivery.add_by_operator_id}
          />

          <MotionWrapper delay={0.4}>
             <DeliveryTransitList
                transits={delivery.transits}
                formatDateTime={formatDateTime}
              />
          </MotionWrapper>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          <MotionWrapper delay={0.3}>
            <DeliveryPaymentCard
              totalPrice={totalPrice}
              basePrice={route?.base_price ?? 0}
              extraCost={delivery.transits.reduce((sum, t) => sum + (t.transit_point.extra_cost ?? 0), 0)}
              isPaid={!!delivery.finished_at}
              paymentMethod="SISTEM TRANSFER"
              formatCurrency={formatCurrency}
            />
          </MotionWrapper>
          
          <BentoCard title="Log Sistem" subtitle="Riwayat pembaruan" icon={<MonitorCheck className="h-5 w-5" />}>
             <div className="mt-4 px-6 py-8 border-2 border-dashed rounded-3xl bg-secondary/10 text-center space-y-4">
                <div className="flex flex-col gap-1">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Update Terakhir</p>
                   <p className="text-sm font-bold text-primary">{formatDateTime(Date.now())}</p>
                </div>
                <div className="flex items-center justify-center gap-3 py-2 px-4 bg-background/50 rounded-2xl border w-fit mx-auto">
                   <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Koneksi: Bagus</span>
                </div>
             </div>
          </BentoCard>

          <MotionWrapper delay={0.5}>
             <BentoCard className="bg-primary text-primary-foreground">
                <div className="space-y-6">
                   <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Globe className="h-6 w-6" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-bold">Pelacakan GPS Aktif</h3>
                      <p className="text-xs font-medium opacity-80 leading-relaxed">
                         Lokasi driver dipantau langsung menggunakan GPS untuk menjamin keamanan dan ketepatan waktu pengiriman.
                      </p>
                   </div>
                   <button className="w-full py-4 bg-white text-primary rounded-2xl text-xs font-bold hover:bg-white/90 transition-all">
                      Buka Peta Lokasi
                   </button>
                </div>
             </BentoCard>
          </MotionWrapper>
        </div>
      </div>
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/5 to-transparent pt-12" />
    </div>
  );
}
