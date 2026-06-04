"use client";

import { useDrivers, useDriverAvailable } from "@/hooks/useUser";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import CreateUserModal from "@/components/shared/modal/CreateUserModal";
import { useState } from "react";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { BentoCard } from "@/components/shared/BentoCard";
import { Users, UserCheck, Shield, Activity } from "lucide-react";

export default function DriverPage() {
  const [filter, setFilter] = useState<"all" | "available">("all");

  const { data: allDrivers, isLoading: isLoadingAll } = useDrivers();
  const { data: availableDrivers, isLoading: isLoadingAvailable } = useDriverAvailable();

  const drivers = filter === "all" ? allDrivers : availableDrivers;
  const isLoading = filter === "all" ? isLoadingAll : isLoadingAvailable;

  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12 space-y-10">
      {/* Page Header */}
      <MotionWrapper className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/90">
            Daftar Driver
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Kelola data driver dan akun mereka.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CreateUserModal />
        </div>
      </MotionWrapper>

      {/* Stats Summary Bento Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <BentoCard 
           title="Total Driver" 
           subtitle="Semua driver" 
           icon={<Users className="h-5 w-5" />} 
           delay={0.1}
         >
            <div className="text-3xl font-bold">{allDrivers?.length || 0}</div>
         </BentoCard>
         <BentoCard 
           title="Driver Tersedia" 
           subtitle="Siap ditugaskan" 
           icon={<UserCheck className="h-5 w-5" />} 
           delay={0.2}
           className="border-primary/20 bg-primary/5"
         >
            <div className="text-3xl font-bold text-primary">{availableDrivers?.length || 0}</div>
         </BentoCard>
      </div>

      {/* Main Registry Console */}
      <MotionWrapper delay={0.3}>
        <BentoCard
          title="Data Driver"
          subtitle="Daftar semua driver"
          icon={<Shield className="h-5 w-5" />}
        >
          <div className="space-y-8 pt-4">
            {/* Table Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/40">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tampilkan</span>
                <div className="flex p-1 bg-secondary/50 rounded-2xl border border-border/30 w-fit">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${
                      filter === "all"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setFilter("available")}
                    className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${
                      filter === "available"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    Tersedia Saja
                  </button>
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="min-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Memuat data driver...</p>
                </div>
              ) : (
                <DataTable columns={columns} data={drivers || []} />
              )}
            </div>
          </div>
        </BentoCard>
      </MotionWrapper>
    </div>
  );
}
