"use client";

import ChangeDriverModal from "@/components/shared/modal/ChangeDriverModal";
import CreateDeliveryModal from "@/components/shared/modal/CreateDeliveryModal";
import DeliveryCard from "@/components/shared/delivery/DeliveryCard";
import DeliveryEmptyState from "@/components/shared/delivery/DeliveryEmptyState";
import DeliverySearchBar from "@/components/shared/delivery/DeliverySearchBar";
import DeliveryStatsCards from "@/components/shared/delivery/DeliveryStatsCards";
import { Button } from "@/components/ui/button";
import { useDeliveriesActive, useUser } from "@/hooks";
import { History, Activity, Database, Truck, Globe } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DeliveryData } from "@/types/api";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { BentoCard } from "@/components/shared/BentoCard";

function useDriverName(driverId: string) {
  const { data: driver } = useUser(driverId);
  return driver?.username;
}

export default function PengirimanPage() {
  const { data: pengirimanData, isLoading: loading } = useDeliveriesActive();

  const [searchQuery, setSearchQuery] = useState("");
  const [changeDriverModalOpen, setChangeDriverModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(null);

  const currentDriverName = useDriverName(selectedDelivery?.worker_id || "");

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (days > 0) return `${days}h ${hours}j yang lalu`;
    if (hours > 0) return `${hours}j yang lalu`;
    return `${minutes}m yang lalu`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredData = useMemo(() => {
    if (!pengirimanData) return [];

    return pengirimanData.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.id.toLowerCase().includes(query) ||
        item.truck_id.toLowerCase().includes(query) ||
        item.route_id.toLowerCase().includes(query) ||
        item.worker_id.toLowerCase().includes(query)
      );
    });
  }, [pengirimanData, searchQuery]);

  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12 space-y-10">
      {/* Page Header */}
      <MotionWrapper className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/90">
            Pengiriman Aktif
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Lihat dan kelola semua pengiriman yang sedang berjalan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pengiriman/history">
            <Button variant="ghost" className="rounded-2xl font-bold text-xs gap-2 bg-secondary/50 hover:bg-secondary">
              <History className="h-4 w-4" />
              Riwayat
            </Button>
          </Link>
          <CreateDeliveryModal />
        </div>
      </MotionWrapper>

      {/* Stats Quick View Bento Grid */}
      <DeliveryStatsCards
        totalActive={pengirimanData?.length || 0}
        totalFiltered={filteredData.length}
      />

      {/* Control Console (Search Bar) */}
      <MotionWrapper delay={0.3}>
        <BentoCard
          title="Cari Pengiriman"
          subtitle="Cari berdasarkan ID, truk, rute, atau driver"
          icon={<Database className="h-5 w-5" />}
        >
          <div className="pt-2">
            <DeliverySearchBar
               searchQuery={searchQuery}
               setSearchQuery={setSearchQuery}
            />
          </div>
        </BentoCard>
      </MotionWrapper>

      {/* Operations Feed Area */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
            Sedang Dikirim ({filteredData.length})
          </span>
          <div className="h-[1px] flex-1 bg-border/40" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="h-14 w-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Memuat data...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <MotionWrapper delay={0.4}>
            <div className="py-24">
               <DeliveryEmptyState />
            </div>
          </MotionWrapper>
        ) : (
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            {filteredData.map((item, index) => (
              <MotionWrapper key={item.id} delay={index * 0.05 + 0.4}>
                <DeliveryCard
                  delivery={item}
                  formatTimeAgo={formatTimeAgo}
                  formatDate={formatDate}
                  onChangeDriver={(delivery) => {
                    setSelectedDelivery(delivery);
                    setChangeDriverModalOpen(true);
                  }}
                />
              </MotionWrapper>
            ))}
          </div>
        )}
      </div>

      {/* Modals Interface */}
      {selectedDelivery && (
        <ChangeDriverModal
          open={changeDriverModalOpen}
          onOpenChange={setChangeDriverModalOpen}
          deliveryId={selectedDelivery.id}
          currentDriverId={selectedDelivery.worker_id}
          currentDriverName={currentDriverName}
        />
      )}
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/5 to-transparent pt-12" />
    </div>
  );
}
