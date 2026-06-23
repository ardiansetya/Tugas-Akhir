"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouteData } from "@/types/api";
import { ChevronLeft, ChevronRight, MapPin, Activity } from "lucide-react";
import {
  ColumnDef,
  Table as TableType,
  flexRender,
} from "@tanstack/react-table";
import { TechCard } from "@/components/shared/TechCard";
import { cn } from "@/lib/utils";

interface RouteTableProps {
  table: TableType<RouteData>;
  columns: ColumnDef<RouteData>[];
  isLoading: boolean;
}

export default function RouteTable({
  table,
  columns,
  isLoading,
}: RouteTableProps) {
  return (
    <TechCard title="Daftar Rute" subtitle="INFORMASI NAVIGASI JALUR">
      <div className="space-y-4 pt-2">
        <div className="relative w-full overflow-auto rounded-xl border border-border/30 bg-background/30">
          <Table>
            <TableHeader className="bg-secondary/20">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-border/50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-12 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/70">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground animate-pulse">Memindai Rute...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-primary/5 border-border/30 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4 text-xs font-medium">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="p-4 bg-secondary/30 rounded-full border border-border/50 mb-4">
                        <MapPin className="h-8 w-8 opacity-20" />
                      </div>
                      <h3 className="text-sm font-display uppercase tracking-widest font-bold">Rute Tidak Ditemukan</h3>
                      <p className="text-[10px] font-mono mt-1 opacity-60">TIDAK ADA KOORDINAT YANG COCOK DENGAN PENCARIAN SAAT INI</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Technical Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 border-t border-border/30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">Jumlah per Halaman</span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-[72px] rounded-lg border-border/50 bg-secondary/20 font-mono text-xs">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top" className="rounded-xl border-border bg-popover/90 backdrop-blur-xl">
                  {[5, 10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs font-mono">
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-muted-foreground/40">
              <Activity className="h-3 w-3" />
              TOTAL DATA: {table.getRowModel().rows.length} RUTE
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
              HALAMAN {table.getState().pagination.pageIndex + 1} DARI {table.getPageCount()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TechCard>
  );
}
