"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { RouteData } from "@/types/api";
import {
  MapPin,
  ArrowRight,
  Navigation,
  Clock,
  DollarSign,
  Package,
  Calendar,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface RouteDetailModalProps {
  route: RouteData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RouteDetailModal = ({
  route,
  open,
  onOpenChange,
}: RouteDetailModalProps) => {
  if (!route) return null;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detail Rute</DialogTitle>
          <DialogDescription>
            Informasi lengkap mengenai rute pengiriman
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Route ID & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ID Rute</p>
              <p className="text-lg font-semibold">{route.id}</p>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                route.is_active
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                  : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
              }`}>
              {route.is_active ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Aktif
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Tidak Aktif
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Route Path */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
              Jalur Rute
            </h3>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
              <div className="flex items-center gap-2 flex-1">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Kota Asal</p>
                  <p className="text-base font-bold">{route.start_city_name}</p>
                </div>
              </div>

              <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />

              <div className="flex items-center gap-2 flex-1 justify-end">
                <div>
                  <p className="text-xs text-muted-foreground text-right">
                    Kota Tujuan
                  </p>
                  <p className="text-base font-bold text-right">
                    {route.end_city_name}
                  </p>
                </div>
                <div className="p-2 bg-purple-500 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Route Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
              Detail Rute
            </h3>
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">
                {route.details}
              </p>
            </div>
          </div>

          <Separator />

          {/* Route Information Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
              Informasi Rute
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Distance */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Navigation className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Jarak</p>
                    <p className="text-xl font-bold">{route.distance_km} KM</p>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Estimasi Waktu
                    </p>
                    <p className="text-xl font-bold">
                      {route.estimated_duration_hours} Jam
                    </p>
                  </div>
                </div>
              </div>

              {/* Base Price */}
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Harga Dasar
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(route.base_price)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cargo Type */}
              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tipe Kargo</p>
                    <p className="text-lg font-bold">{route.cargo_type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Created Date */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
              Informasi Tambahan
            </h3>
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Tanggal Dibuat</p>
                <p className="text-sm font-semibold">
                  {formatDate(route.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteDetailModal;
