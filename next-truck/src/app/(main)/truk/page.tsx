"use client";

import CreateNewTruckModal from "@/components/shared/modal/CreateNewTruckModal";
import TruckCard from "@/components/shared/truck/TruckCard";
import TruckEmptyState from "@/components/shared/truck/TruckEmptyState";
import TruckSearchFilter from "@/components/shared/truck/TruckSearchFilter";
import TruckStatsCards from "@/components/shared/truck/TruckStatsCards";
import { useTrucks, useUpdateTruckAvailability } from "@/hooks";
import { useMemo, useState } from "react";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { BentoCard } from "@/components/shared/BentoCard";
import { Activity, Database } from "lucide-react";

export default function TruckPage() {
  const { data: truckData, isLoading: loading } = useTrucks();
  const { mutate } = useUpdateTruckAvailability();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [selectedCargoType, setSelectedCargoType] = useState<string>("all");

  const cargoTypes = useMemo(() => {
    if (!truckData) return ["all"];
    return ["all", ...Array.from(new Set(truckData.map((t) => t.cargo_type)))];
  }, [truckData]);

  const filteredData = useMemo(() => {
    if (!truckData) return [];

    return truckData.filter((truck) => {
      const matchesSearch =
        truck.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        truck.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        truck.model.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAvailability =
        selectedFilter === "all" ||
        (selectedFilter === "available" && truck.is_available) ||
        (selectedFilter === "unavailable" && !truck.is_available);

      const matchesCargoType =
        selectedCargoType === "all" || truck.cargo_type === selectedCargoType;

      return matchesSearch && matchesAvailability && matchesCargoType;
    });
  }, [truckData, searchQuery, selectedFilter, selectedCargoType]);

  const stats = useMemo(() => {
    if (!truckData) {
      return { total: 0, available: 0, unavailable: 0, totalCapacity: 0 };
    }

    return {
      total: truckData.length,
      available: truckData.filter((t) => t.is_available).length,
      unavailable: truckData.filter((t) => !t.is_available).length,
      totalCapacity: truckData.reduce((sum, t) => sum + t.capacity_kg, 0),
    };
  }, [truckData]);

  const formatCapacity = (kg: number) => {
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(1)} Ton`;
    }
    return `${kg} Kg`;
  };

  const handleToggleAvailability = (truckId: string, isAvailable: boolean) => {
    mutate({ isAvailable, truckId });
  };

  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12 space-y-10">
      {/* Page Header */}
      <MotionWrapper className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/90">
            Daftar Truk
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Kelola data truk dan statusnya.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CreateNewTruckModal />
        </div>
      </MotionWrapper>

      {/* Stats Summary Bento Section */}
      <TruckStatsCards stats={stats} />

      {/* Main Console Section */}
      <div className="space-y-8">
        <MotionWrapper delay={0.3}>
          <BentoCard
            title="Filter & Cari"
            subtitle="Cari truk"
            icon={<Database className="h-5 w-5" />}
          >
            <div className="pt-2">
              <TruckSearchFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                selectedCargoType={selectedCargoType}
                setSelectedCargoType={setSelectedCargoType}
                cargoTypes={cargoTypes}
              />
            </div>
          </BentoCard>
        </MotionWrapper>

        {/* Unit Feed Area */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              Truk Ditemukan ({filteredData.length})
            </span>
            <div className="h-[1px] flex-1 bg-border/40" />
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
               <Activity className="h-4 w-4" />
               Status Terkini
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="h-14 w-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Memuat data truk...</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredData.map((truck, index) => (
                <MotionWrapper key={truck.id} delay={index * 0.05 + 0.4}>
                  <TruckCard
                    truck={truck}
                    onToggleAvailability={handleToggleAvailability}
                    formatCapacity={formatCapacity}
                  />
                </MotionWrapper>
              ))}
            </div>
          )}

          {!loading && filteredData.length === 0 && (
            <MotionWrapper delay={0.5}>
              <div className="py-24">
                <TruckEmptyState />
              </div>
            </MotionWrapper>
          )}
        </div>
      </div>
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/5 to-transparent pt-12" />
    </div>
  );
}
