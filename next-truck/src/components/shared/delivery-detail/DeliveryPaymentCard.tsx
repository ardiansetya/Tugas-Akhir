import { TechCard } from "@/components/shared/TechCard";
import { Badge } from "@/components/ui/badge";
import { Receipt, Hash, CreditCard, Clock, CheckCircle2, History } from "lucide-react";
import { MotionWrapper } from "@/components/shared/MotionWrapper";

interface DeliveryPaymentCardProps {
  totalPrice: number;
  basePrice: number;
  extraCost: number;
  isPaid: boolean;
  paymentMethod: string;
  formatCurrency: (amount: number) => string;
}

export default function DeliveryPaymentCard({
  totalPrice,
  basePrice,
  extraCost,
  isPaid,
  paymentMethod,
  formatCurrency,
}: DeliveryPaymentCardProps) {
  const items = [
    {
      label: "Harga Dasar Rute",
      value: formatCurrency(basePrice),
      icon: Hash,
      desc: "Harga rute awal"
    },
    {
      label: "Biaya Tambahan Transit",
      value: formatCurrency(extraCost),
      icon: History,
      desc: "Total biaya transit"
    }
  ];

  return (
    <TechCard
      title="Rincian Pembayaran"
      subtitle="Info pembayaran"
      icon={<Receipt className="h-4 w-4" />}
    >
      <div className="space-y-6 pt-2">
        {/* Status Badge */}
        <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-border/50">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Status Pembayaran</span>
          </div>
          <Badge 
            className={isPaid 
              ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" 
              : "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
            }
          >
            {isPaid ? "LUNAS" : "BELUM BAYAR"}
          </Badge>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <MotionWrapper key={item.label} delay={index * 0.1}>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/50 rounded-lg group-hover:bg-primary/10 transition-colors">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-tight leading-none">{item.label}</p>
                    <p className="text-[8px] font-mono text-muted-foreground/60 uppercase tracking-tighter mt-1">{item.desc}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold">{item.value}</span>
              </div>
            </MotionWrapper>
          ))}
        </div>

        {/* Total Surface */}
        <div className="pt-4 mt-2 border-t border-border/50">
          <div className="flex items-end justify-between bg-secondary/10 p-4 rounded-2xl border border-primary/10 shadow-inner">
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-[0.3em] block">Detail Transaksi</span>
              <span className="text-[10px] font-display font-bold uppercase tracking-widest text-primary/80">Total Bayar</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-display text-primary">{formatCurrency(totalPrice)}</div>
              <div className="flex items-center justify-end gap-1 mt-1 text-[8px] font-mono text-muted-foreground/40">
                <Clock className="h-2.5 w-2.5" />
                Terakhir diperbarui
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Footer */}
        <div className="flex items-center gap-2 pt-2 text-[8px] font-mono text-muted-foreground/40 uppercase tracking-widest">
           <CheckCircle2 className="h-3 w-3 text-primary/40" />
           METODE: {paymentMethod || "DEFAULT"}
        </div>
      </div>
    </TechCard>
  );
}
