import { TechCard } from "@/components/shared/TechCard";
import { CheckCircle2, MapPin, XCircle } from "lucide-react";
import { MotionWrapper } from "@/components/shared/MotionWrapper";

interface RouteStatsCardsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
}

export default function RouteStatsCards({ stats }: RouteStatsCardsProps) {
  const cards = [
    {
      title: "Ringkasan Rute",
      subtitle: "Total Jalur Rute",
      value: stats.total,
      icon: MapPin,
      color: "text-blue-500",
      description: "Total koridor pengiriman yang telah ditentukan"
    },
    {
      title: "Rute Aktif",
      subtitle: "Sinyal Jaringan Siap",
      value: stats.active,
      icon: CheckCircle2,
      color: "text-green-500",
      description: "Rute yang tersedia untuk penempatan saat ini"
    },
    {
      title: "Rute Nonaktif",
      subtitle: "Catatan Pemeliharaan",
      value: stats.inactive,
      icon: XCircle,
      color: "text-red-500",
      description: "Rute yang dinonaktifkan sementara"
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
              <div className="text-4xl font-display">{card.value}</div>
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
