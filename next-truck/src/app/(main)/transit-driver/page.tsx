"use client";

import RejectTransitModal from "@/components/shared/modal/RejectTransitModal";
import TransitDriverCard from "@/components/shared/transit-driver/TransitDriverCard";
import TransitDriverEmptyState from "@/components/shared/transit-driver/TransitDriverEmptyState";
import TransitDriverSearchFilter from "@/components/shared/transit-driver/TransitDriverSearchFilter";
import TransitDriverStatsCards from "@/components/shared/transit-driver/TransitDriverStatsCards";
import { Button } from "@/components/ui/button";
import { useAcceptOrRejectTransit, useTransits } from "@/hooks";
import type { TransitData } from "@/types/api";
import { Activity, Waypoints, Database } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { BentoCard } from "@/components/shared/BentoCard";

export default function TransitDriverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedTransitId, setSelectedTransitId] = useState<string>("");

  const { data: transitData = [], isLoading, error } = useTransits();
  const { mutate: acceptOrRejectTransit, isPending: isProcessing } = useAcceptOrRejectTransit();

  const formatTimeAgo = (timestamp: number) => {
    if (timestamp === 0) return "-";
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (hours > 0) return `${hours}j yang lalu`;
    return `${minutes}m yang lalu`;
  };

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return "-";
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatus = (transit: TransitData) => {
    if (!transit.actioned_at || transit.is_accepted === null) return "pending";
    return transit.is_accepted ? "accepted" : "rejected";
  };

  const filteredData = useMemo(() => {
    return transitData.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.delivery_id.toLowerCase().includes(searchQuery.toLowerCase());

      const status = getStatus(item);
      const matchesStatus =
        selectedStatus === "all" || status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [transitData, searchQuery, selectedStatus]);

  const stats = useMemo(
    () => ({
      total: transitData.length,
      pending: transitData.filter((t) => getStatus(t) === "pending").length,
      accepted: transitData.filter((t) => getStatus(t) === "accepted").length,
      rejected: transitData.filter((t) => getStatus(t) === "rejected").length,
    }),
    [transitData]
  );

  const handleAccept = (transitId: string) => {
    acceptOrRejectTransit(
      {
        deliveryTransitId: transitId,
        isAccepted: true,
        reason: "Disetujui",
      },
      {
        onSuccess: () => {
          toast.success("Transit berhasil disetujui");
        },
        onError: () => {
          toast.error("Gagal menyetujui transit");
        },
      }
    );
  };

  const handleRejectClick = (transitId: string) => {
    setSelectedTransitId(transitId);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = (reason: string) => {
    acceptOrRejectTransit(
      {
        deliveryTransitId: selectedTransitId,
        isAccepted: false,
        reason,
      },
      {
        onSuccess: () => {
          toast.success("Transit berhasil ditolak");
          setRejectModalOpen(false);
          setSelectedTransitId("");
        },
        onError: () => {
          toast.error("Gagal menolak transit");
        },
      }
    );
  };

  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12 space-y-10">
      {/* Header Halaman */}
      <MotionWrapper className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/90">
            Persetujuan Transit
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Setujui atau tolak permintaan transit dari driver.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/daftar-transit">
            <Button variant="ghost" className="rounded-2xl font-bold text-xs gap-2 bg-secondary/50 hover:bg-secondary border shadow-sm">
              <Waypoints className="h-4 w-4" />
              Kelola Transit
            </Button>
          </Link>
        </div>
      </MotionWrapper>

      {/* Bento Grid Ringkasan Statistik */}
      <TransitDriverStatsCards stats={stats} />

      {/* Area Pengontrol Misi */}
      <div className="space-y-8">
        <MotionWrapper delay={0.2}>
          <BentoCard
            title="Filter & Cari"
            subtitle="Cari berdasarkan ID"
            icon={<Database className="h-5 w-5" />}
          >
            <div className="pt-2">
              <TransitDriverSearchFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
              />
            </div>
          </BentoCard>
        </MotionWrapper>

        {/* Area Kisi Tugas */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              Transit Ditemukan ({filteredData.length})
            </span>
            <div className="h-[1px] flex-1 bg-border/40" />
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
               <Activity className="h-4 w-4" />
               Data Terkini
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="h-14 w-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Memuat data transit...</p>
            </div>
          ) : error ? (
            <MotionWrapper delay={0.3}>
              <div className="py-24">
                 <TransitDriverEmptyState type="error" />
              </div>
            </MotionWrapper>
          ) : filteredData.length === 0 ? (
            <MotionWrapper delay={0.3}>
              <div className="py-24">
                 <TransitDriverEmptyState type="empty" />
              </div>
            </MotionWrapper>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {filteredData.map((transit, index) => (
                <MotionWrapper key={transit.id} delay={index * 0.05 + 0.3}>
                  <TransitDriverCard
                    transit={transit}
                    status={getStatus(transit)}
                    onAccept={handleAccept}
                    onReject={handleRejectClick}
                    isProcessing={isProcessing}
                    formatTimeAgo={formatTimeAgo}
                    formatDate={formatDate}
                  />
                </MotionWrapper>
              ))}
            </div>
          )}
        </div>
      </div>

      <RejectTransitModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        onConfirm={handleRejectConfirm}
        isLoading={isProcessing}
      />
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/5 to-transparent pt-12" />
    </div>
  );
}
