import { TechCard } from "@/components/shared/TechCard";
import { CheckCircle, MapPin, XCircle } from "lucide-react";
import { MotionWrapper } from "@/components/shared/MotionWrapper";

interface TransitStatsCardsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
}

export default function TransitStatsCards({ stats }: TransitStatsCardsProps) {
  const cards = [
    {
      title: "Jaringan Transit",
      subtitle: "Total Lokasi Transit",
      value: stats.total,
      icon: MapPin,
      color: "text-blue-500",
      description: "Titik transit terdaftar dalam jaringan"
    },
    {
      title: "Pos Aktif",
      subtitle: "Siap Serah Terima",
      value: stats.active,
      icon: CheckCircle,
      color: "text-green-500",
      description: "Stasiun serah terima yang beroperasi penuh"
    },
    {
      title: "Pos Nonaktif",
      subtitle: "Koneksi Terputus",
      value: stats.inactive,
      icon: XCircle,
      color: "text-red-400",
      description: "Titik yang saat ini tidak sinkron dengan jaringan"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
