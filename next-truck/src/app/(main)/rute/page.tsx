"use client";

import CreateRouteModal from "@/components/shared/modal/CreateRouteModal";
import RouteDetailModal from "@/components/shared/modal/RouteDetailModal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RouteFilters from "@/components/shared/route/RouteFilters";
import RouteStatsCards from "@/components/shared/route/RouteStatsCards";
import RouteTable from "@/components/shared/route/RouteTable";
import { createRouteTableColumns } from "@/components/shared/route/RouteTableColumns";
import { useRoutes } from "@/hooks";
import { RouteData } from "@/types/api";
import { useCallback, useMemo, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MotionWrapper } from "@/components/shared/MotionWrapper";
import { BentoCard } from "@/components/shared/BentoCard";
import { Database, Activity, Waypoints } from "lucide-react";

export default function RutePage() {
  const { data: routeData, isLoading } = useRoutes();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedCargoType, setSelectedCargoType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleDetailClick = (route: RouteData) => {
    setSelectedRoute(route);
    setDetailModalOpen(true);
  };

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  const columns = useMemo(
    () => createRouteTableColumns(formatCurrency, handleDetailClick),
    [formatCurrency]
  );

  const cargoTypes = useMemo(() => {
    return ["all", ...Array.from(new Set(routeData?.map((r) => r.cargo_type)))];
  }, [routeData]);

  const filteredData = useMemo(() => {
    if (!routeData) return [];

    return routeData.filter((route) => {
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && route.is_active) ||
        (selectedStatus === "inactive" && !route.is_active);

      const matchesCargoType =
        selectedCargoType === "all" || route.cargo_type === selectedCargoType;

      const matchesSearch =
        !searchQuery ||
        route.start_city_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.end_city_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.cargo_type.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesCargoType && matchesSearch;
    });
  }, [routeData, selectedStatus, selectedCargoType, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: routeData?.length || 0,
      active: routeData?.filter((r) => r.is_active).length || 0,
      inactive: routeData?.filter((r) => !r.is_active).length || 0,
    };
  }, [routeData]);

  const table = useReactTable({
    data: filteredData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="container mx-auto p-6 md:p-10 lg:p-12 space-y-10">
      {/* Page Header */}
      <MotionWrapper className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground/90">
            Daftar Rute
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Kelola semua rute pengiriman.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="rounded-2xl h-11 px-6 border-border/50 hover:bg-secondary transition-all font-bold gap-2">
            <Link href="/daftar-transit">
              <Waypoints className="h-4 w-4 text-primary" />
              Kelola Transit
            </Link>
          </Button>
          <CreateRouteModal />
        </div>
      </MotionWrapper>

      {/* Stats Summary Bento Section */}
      <RouteStatsCards stats={stats} />

      {/* Control Console Area */}
      <div className="space-y-8">
        <MotionWrapper delay={0.3}>
          <BentoCard
            title="Filter & Cari"
            subtitle="Cari rute"
            icon={<Database className="h-5 w-5" />}
          >
            <div className="pt-2">
              <RouteFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedCargoType={selectedCargoType}
                setSelectedCargoType={setSelectedCargoType}
                cargoTypes={cargoTypes}
                table={table}
              />
            </div>
          </BentoCard>
        </MotionWrapper>

        {/* Network Ledger Area */}
        <div className="space-y-6">
           <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              Rute Ditemukan ({filteredData.length})
            </span>
            <div className="h-[1px] flex-1 bg-border/40" />
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
               <Activity className="h-4 w-4" />
               Terhubung
            </div>
          </div>

          <MotionWrapper delay={0.4}>
            <BentoCard className="p-0 overflow-hidden">
               <RouteTable table={table} columns={columns} isLoading={isLoading} />
            </BentoCard>
          </MotionWrapper>
        </div>
      </div>

      {/* Modal Interfaces */}
      <RouteDetailModal
        route={selectedRoute}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/5 to-transparent pt-12" />
    </div>
  );
}
