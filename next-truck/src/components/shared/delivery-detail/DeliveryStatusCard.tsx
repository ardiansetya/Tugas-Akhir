"use client";

import { TechCard } from "@/components/shared/TechCard";
import {
  Calendar,
  Clock,
  Package,
  CheckCircle2,
  Navigation,
  Activity,
  Zap,
  Timer,
  Layers,
  MapPin
} from "lucide-react";
import { DeliveryDetailData } from "@/types/api";
import { MotionWrapper } from "@/components/shared/MotionWrapper";

interface DeliveryStatusCardsProps {
  delivery: DeliveryDetailData;
  duration: string;
  acceptedTransits: number;
  totalTransits: number;
  formatDate: (t: number) => string;
  formatTime: (t: number) => string;
}

export function DeliveryStatusCards({
  delivery,
  duration,
  acceptedTransits,
  totalTransits,
  formatDate,
  formatTime,
}: DeliveryStatusCardsProps) {
  const isFinished = !!delivery.finished_at;

  const cards = [
    {
      title: "Mulai Kirim",
      subtitle: "Jam Berangkat",
      date: formatDate(delivery.started_at * 1000),
      time: formatTime(delivery.started_at * 1000),
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "Lama Perjalanan",
      subtitle: "Total waktu",
      date: duration,
      time: "GPS AKTIF",
      icon: Timer,
      color: "text-amber-500",
    },
    {
      title: "Pos Transit",
      subtitle: "Transit selesai",
      date: `${acceptedTransits} Titik`,
      time: `DARI ${totalTransits} TITIK TRANSIT`,
      icon: MapPin,
      color: "text-primary",
    },
    {
      title: isFinished ? "Selesai" : "Posisi Saat Ini",
      subtitle: isFinished ? "Pengiriman selesai" : "Sinyal aktif",
      date: isFinished ? formatDate(delivery.finished_at! * 1000) : "SEDANG DI JALAN",
      time: isFinished ? formatTime(delivery.finished_at! * 1000) : "GPS AKTIF",
      icon: isFinished ? CheckCircle2 : Navigation,
      color: isFinished ? "text-green-500" : "text-blue-500 animate-pulse",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <MotionWrapper key={card.title} delay={index * 0.1}>
          <TechCard
            title={card.title}
            subtitle={card.subtitle}
            icon={<card.icon className={card.color} />}
          >
            <div className="pt-2">
              <div className="text-xl font-bold tracking-tight text-foreground/90">{card.date}</div>
              <div className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" />
                {card.time}
              </div>
            </div>
          </TechCard>
        </MotionWrapper>
      ))}
    </div>
  );
}
