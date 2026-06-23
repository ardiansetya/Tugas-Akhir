import UpdateRouteModal from "@/components/shared/modal/UpdateRouteModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RouteData } from "@/types/api";
import {
  ArrowRight,
  ArrowUpDown,
  CheckCircle2,
  Eye,
  MapPin,
  Package,
  XCircle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { formatDurationHours } from "@/lib/utils";

export const createRouteTableColumns = (
  formatCurrency: (amount: number) => string,
  handleDetailClick: (route: RouteData) => void
): ColumnDef<RouteData>[] => [
  {
    accessorKey: "route",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Rute
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const route = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <MapPin className="h-3 w-3 text-primary" />
            {route.start_city_name}
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="h-3 w-3 text-muted-foreground ml-0.5" />
            <span className="text-sm font-medium text-muted-foreground">
              {route.end_city_name}
            </span>
          </div>
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      return rowA.original.start_city_name.localeCompare(
        rowB.original.start_city_name
      );
    },
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
      <Badge variant="outline" className="font-normal">
        <Package className="h-3 w-3 mr-1" />
        {row.getValue("cargo_type")}
      </Badge>
    ),
  },
  {
    accessorKey: "distance_km",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Jarak
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium">
          {row.getValue("distance_km")} KM
        </span>
      );
    },
  },
  {
    accessorKey: "estimated_duration_hours",
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
        <span className="text-sm font-medium">
          {formatDurationHours(row.getValue("estimated_duration_hours"))}
        </span>
      );
    },
  },
  {
    accessorKey: "base_price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Harga Dasar
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-sm font-semibold text-accent-foreground dark:text-accent-foreground">
          {formatCurrency(row.getValue("base_price"))}
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
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Aktif
        </Badge>
      ) : (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Tidak Aktif
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (value === "all") return true;
      if (value === "active") return row.getValue(id) === true;
      if (value === "inactive") return row.getValue(id) === false;
      return true;
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const route = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDetailClick(route)}
            className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
            <span className="sr-only">Detail</span>
          </Button>
          <UpdateRouteModal routeId={route.id} />
        </div>
      );
    },
  },
];
