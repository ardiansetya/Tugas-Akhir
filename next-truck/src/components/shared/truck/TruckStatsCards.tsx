import { TechCard } from "@/components/shared/TechCard";
import { CheckCircle2, Truck, XCircle } from "lucide-react";
import { MotionWrapper } from "@/components/shared/MotionWrapper";

interface TruckStatsCardsProps {
  stats: {
    total: number;
    available: number;
    unavailable: number;
    totalCapacity: number;
  };
}

export default function TruckStatsCards({ stats }: TruckStatsCardsProps) {
  const cards = [
    {
      title: "Inventaris Armada",
      subtitle: "Total Unit Terdaftar",
      value: stats.total,
      icon: Truck,
      color: "text-blue-500",
      description: "Total truk yang terdaftar dalam sistem"
    },
    {
      title: "Unit Siap Pakai",
      subtitle: "Siap Untuk Tugas",
      value: stats.available,
      icon: CheckCircle2,
      color: "text-green-500",
      description: "Unit yang saat ini tersedia untuk digunakan"
    },
    {
      title: "Dalam Perbaikan",
      subtitle: "Unit Nonaktif",
      value: stats.unavailable,
      icon: XCircle,
      color: "text-red-500",
      description: "Unit yang sedang dalam perbaikan atau servis"
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
