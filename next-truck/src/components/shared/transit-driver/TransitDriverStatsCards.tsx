import { TechCard } from "@/components/shared/TechCard";
import { AlertCircle, CheckCircle2, MapPin, XCircle } from "lucide-react";
import { MotionWrapper } from "@/components/shared/MotionWrapper";

interface TransitDriverStatsCardsProps {
  stats: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
}

export default function TransitDriverStatsCards({
  stats,
}: TransitDriverStatsCardsProps) {
  const cards = [
    {
      title: "Total Transit",
      subtitle: "Semua transit terdaftar",
      value: stats.total,
      icon: MapPin,
      color: "text-blue-500",
      description: "Jumlah seluruh data transit"
    },
    {
      title: "Menunggu",
      subtitle: "Perlu persetujuan",
      value: stats.pending,
      icon: AlertCircle,
      color: "text-amber-500",
      description: "Transit menunggu disetujui"
    },
    {
      title: "Disetujui",
      subtitle: "Transit berhasil",
      value: stats.accepted,
      icon: CheckCircle2,
      color: "text-green-500",
      description: "Jumlah transit disetujui"
    },
    {
      title: "Ditolak",
      subtitle: "Transit ditolak",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-500",
      description: "Jumlah transit ditolak"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <MotionWrapper key={card.title} delay={index * 0.1}>
          <TechCard
            title={card.title}
            subtitle={card.subtitle}
            icon={<card.icon className={card.color} />}
          >
            <div className="pt-2">
              <div className="text-4xl font-display uppercase">{card.value}</div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                {card.description}
              </p>
            </div>
          </TechCard>
        </MotionWrapper>
      ))}
    </div>
  );
}
