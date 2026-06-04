import UpdateTransitPointModal from "@/components/shared/modal/UpdateTransitPointModal";
import CityCell from "@/components/shared/CityCell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransitPointData } from "@/types/api";
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  Package,
  XCircle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

export const createTransitTableColumns = (
  formatCurrency: (amount: number) => string,
  formatDuration: (minutes: number) => string
): ColumnDef<TransitPointData>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-mono text-sm font-medium">
          #{row.getValue("id")}
        </div>
      );
    },
  },
  {
    accessorKey: "loading_city",
    header: "Kota Muat",
    cell: ({ row }) => {
      return <CityCell cityId={row.original.loading_city_id} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "unloading_city",
    header: "Kota Tujuan",
    cell: ({ row }) => {
      return <CityCell cityId={row.original.unloading_city_id} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "cargo_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tipe Kargo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal capitalize">
        <Package className="h-3 w-3 mr-1" />
        {row.getValue("cargo_type")}
      </Badge>
    ),
  },
  {
    accessorKey: "estimated_duration_minute",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Estimasi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium">
            {formatDuration(row.getValue("estimated_duration_minute"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "extra_cost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Biaya Extra
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
          {formatCurrency(row.getValue("extra_cost"))}
        </span>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return isActive ? (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          Aktif
        </Badge>
      ) : (
        <Badge variant="secondary">
          <XCircle className="h-3 w-3 mr-1" />
          Nonaktif
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const transitPoint = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <UpdateTransitPointModal transitPointId={transitPoint.id} />
        </div>
      );
    },
  },
];
