import { useUser } from "@/hooks";
import { UserCircle, Shield, Activity, Mail } from "lucide-react";

export function OperatorInfo({ operatorId }: { operatorId: string }) {
  const { data: operator, isLoading } = useUser(operatorId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-10 w-10 bg-secondary/30 rounded-full" />
        <div className="space-y-2">
           <div className="h-3 w-24 bg-secondary/30 rounded" />
           <div className="h-2 w-32 bg-secondary/20 rounded" />
        </div>
      </div>
    );
  }

  if (!operator) return <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Petugas tidak ditemukan: {operatorId}</span>;

  return (
    <div className="flex items-center gap-4 p-3 bg-secondary/10 rounded-xl border border-border/30 group hover:border-primary/20 transition-all">
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
         <UserCircle className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-[10px] font-mono font-bold text-muted-foreground/60 uppercase tracking-widest">Petugas Pembuat</p>
        <p className="text-sm font-bold truncate uppercase tracking-tight">{operator.username}</p>
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/40 lowercase truncate">
           <Mail className="h-3 w-3" />
           {operator.email}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 px-3 py-1 border-l border-border/30">
         <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-green-500 uppercase tracking-tighter">
            <Shield className="h-3 w-3" />
            DISETUJUI
         </div>
         <Activity className="h-3 w-3 text-green-500/20" />
      </div>
    </div>
  );
}