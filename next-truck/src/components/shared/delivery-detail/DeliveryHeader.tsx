"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Activity, ShieldCheck, Box } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeliveryDetailData } from "@/types/api";
import { cn } from "@/lib/utils";
import { MotionWrapper } from "@/components/shared/MotionWrapper";

interface DeliveryHeaderProps {
  delivery: DeliveryDetailData;
}

export function DeliveryHeader({ delivery }: DeliveryHeaderProps) {
  const router = useRouter();
  const isFinished = !!delivery.finished_at;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="h-14 w-14 rounded-2xl bg-secondary/50 hover:bg-secondary border shadow-sm text-muted-foreground hover:text-primary transition-all shrink-0"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
              <Globe className={cn("h-4 w-4", !isFinished && "animate-pulse")} />
              Data Pengiriman
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground/90">Detail Pengiriman</h1>
            <div className="flex items-center gap-2">
               <p className="text-muted-foreground text-sm font-medium truncate">
                ID: {delivery.id}
               </p>
               <div className={cn(
                 "px-2 py-0.5 rounded-lg text-[10px] font-bold bg-secondary/50 border uppercase tracking-widest",
                 isFinished ? "text-green-600 border-green-200 dark:border-green-900" : "text-blue-600 border-blue-200 dark:border-blue-900"
               )}>
                  {isFinished ? "Selesai" : "Berjalan"}
               </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest border shadow-sm transition-all",
            isFinished 
              ? "bg-green-500/5 text-green-600 border-green-500/20" 
              : "bg-primary/5 text-primary border-primary/20 shadow-lg shadow-primary/5"
          )}>
            <div className={cn("w-2 h-2 rounded-full", isFinished ? "bg-green-500" : "bg-primary animate-pulse")} />
            {isFinished ? "Selesai" : "Sedang Dikirim"}
          </div>
          
          <div className="hidden lg:flex items-center gap-4 px-4 py-3 rounded-2xl bg-secondary/30 border text-[10px] font-bold uppercase tracking-widest shadow-sm">
             <div className="flex items-center gap-2 text-muted-foreground/60 border-r pr-4 border-border/40">
                <ShieldCheck className="h-4 w-4 text-primary/60" /> Aman
             </div>
             <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-4 w-4 text-green-500" /> Aktif
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
