"use client";

import CreateTransitPointModal from "@/components/shared/modal/CreateTransitPoint";
import TransitFilters from "@/components/shared/transit/TransitFilters";
import TransitStatsCards from "@/components/shared/transit/TransitStatsCards";
import TransitTable from "@/components/shared/transit/TransitTable";
import { createTransitTableColumns } from "@/components/shared/transit/TransitTableColumns";
import { useTransitPoints, useCities } from "@/hooks";
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
import { Activity, Database, ShieldCheck } from "lucide-react";

export default function TransitPointListPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterCargoType, setFilterCargoType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: transitPoints, isLoading, error } = useTransitPoints();
  const { data: cities = [] } = useCities();

  const cargoTypes = useMemo(() => {
    const types = new Set(transitPoints?.map((tp) => tp.cargo_type));
    return Array.from(types);
  }, [transitPoints]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatDuration = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}j ${mins}m`;
    if (hours > 0) return `${hours}j`;
    return `${mins}m`;
  }, []);

  const columns = useMemo(
    () => createTransitTableColumns(formatCurrency, formatDuration),
    [formatCurrency, formatDuration]
  );

  const filteredData = useMemo(() => {
    if (!transitPoints) return [];

    return transitPoints.filter((item) => {
      const matchesActive =
        filterActive === "all" ||
        (filterActive === "active" && item.is_active) ||
        (filterActive === "inactive" && !item.is_active);

      const matchesCargo =
        filterCargoType === "all" || item.cargo_type === filterCargoType;

      const matchesSearch =
        !searchQuery ||
        item.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cargo_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cities.find(c => c.id === item.loading_city_id)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cities.find(c => c.id === item.unloading_city_id)?.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesActive && matchesCargo && matchesSearch;
    });
  }, [transitPoints, filterActive, filterCargoType, searchQuery, cities]);

  const stats = useMemo(
    () => ({
      total: transitPoints?.length || 0,
      active: transitPoints?.filter((tp) => tp.is_active).length || 0,
      inactive: transitPoints?.filter((tp) => !tp.is_active).length || 0,
    }),
    [transitPoints]
  );

  const table = useReactTable({
    data: filteredData,
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
            Daftar Titik Transit
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Kelola semua titik transit untuk pengiriman.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CreateTransitPointModal />
        </div>
      </MotionWrapper>

      {/* Stats Summary Bento Section */}
      <TransitStatsCards stats={stats} />

      {/* Control Console Area */}
      <div className="space-y-8">
        <MotionWrapper delay={0.3}>
          <BentoCard
            title="Filter & Cari"
            subtitle="Cari titik transit"
            icon={<Database className="h-5 w-5" />}
          >
            <div className="pt-2">
              <TransitFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterActive={filterActive}
                setFilterActive={setFilterActive}
                filterCargoType={filterCargoType}
                setFilterCargoType={setFilterCargoType}
                cargoTypes={cargoTypes}
                table={table}
              />
            </div>
          </BentoCard>
        </MotionWrapper>

        {/* Network Area */}
        <div className="space-y-6">
           <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              Transit Ditemukan ({filteredData.length})
            </span>
            <div className="h-[1px] flex-1 bg-border/40" />
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
               <ShieldCheck className="h-4 w-4" />
               Status Aktif
            </div>
          </div>

          <MotionWrapper delay={0.4}>
            <BentoCard className="p-0 overflow-hidden">
               <TransitTable
                table={table}
                columns={columns}
                isLoading={isLoading}
                error={error}
              />
            </BentoCard>
          </MotionWrapper>
        </div>
      </div>
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/5 to-transparent pt-12" />
    </div>
  );
}
