import { TechCard } from "@/components/shared/TechCard";
import { Truck, MapPin, Activity } from "lucide-react";
import { MotionWrapper } from "@/components/shared/MotionWrapper";

interface DeliveryStatsCardsProps {
  totalActive: number;
  totalFiltered: number;
}

export default function DeliveryStatsCards({
  totalActive,
  totalFiltered,
}: DeliveryStatsCardsProps) {
  const cards = [
    {
      title: "Pengiriman Berjalan",
      subtitle: "Sinyal Sistem Aktif",
      value: totalActive,
      icon: Truck,
      color: "text-green-500",
      description: "Pengiriman yang sedang bergerak di seluruh jaringan"
    },
    {
      title: "Pantauan Langsung",
      subtitle: "Pemantauan Real-time",
      value: totalFiltered,
      icon: MapPin,
      color: "text-blue-500",
      description: "Pengiriman berlangsung yang sesuai dengan kueri saat ini"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card, index) => (
        <MotionWrapper key={card.title} delay={index * 0.1}>
          <TechCard
            title={card.title}
            subtitle={card.subtitle}
            icon={<card.icon className={card.color} />}
          >
            <div className="pt-2 flex items-end justify-between">
              <div>
                <div className="text-4xl font-display">{card.value}</div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                  {card.description}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[8px] font-mono text-muted-foreground/40 mb-1">
                <Activity className="h-3 w-3 animate-pulse" />
                PANTUAN AKTIF
              </div>
            </div>
          </TechCard>
        </MotionWrapper>
      ))}
    </div>
  );
}
