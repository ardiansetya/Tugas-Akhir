"use client";

import { MapPin, Truck, User, Users, Terminal } from "lucide-react";
import { RouteInfo } from "@/components/shared/delivery-detail/RouteInfoDeliveryDetail";
import { TruckInfo } from "@/components/shared/delivery-detail/TruckInfoDeliveryDetail";
import { DriverInfo } from "@/components/shared/delivery-detail/DriverInfoDeliveryDetail";
import { OperatorInfo } from "@/components/shared/delivery-detail/OperatorInfoDeliveryDetail";
import { TechCard } from "@/components/shared/TechCard";
import { MotionWrapper } from "@/components/shared/MotionWrapper";

interface DeliveryInfoSectionProps {
  deliveryId: string;
  routeId: string;
  truckId: string;
  driverId: string;
  operatorId: string;
}

export function DeliveryInfoSection({
  deliveryId,
  routeId,
  truckId,
  driverId,
  operatorId,
}: DeliveryInfoSectionProps) {
  const sections = [
    { 
      title: "Rute Pengiriman", 
      subtitle: "Detail rute", 
      icon: MapPin, 
      component: <RouteInfo routeId={routeId} /> 
    },
    { 
      title: "Truk", 
      subtitle: "Info truk", 
      icon: Truck, 
      component: <TruckInfo truckId={truckId} /> 
    },
    { 
      title: "Driver", 
      subtitle: "Info driver", 
      icon: User, 
      component: <DriverInfo driverId={driverId} deliveryId={deliveryId} /> 
    },
    { 
      title: "Petugas", 
      subtitle: "Info pembuat", 
      icon: Users, 
      component: <OperatorInfo operatorId={operatorId} /> 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
         <div className="h-[1px] flex-1 bg-border/50" />
         <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-muted-foreground/40 flex items-center gap-2">
            <Terminal className="h-3 w-3" />
            Aset Pengiriman
         </span>
         <div className="h-[1px] flex-1 bg-border/50" />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, index) => (
          <MotionWrapper key={section.title} delay={index * 0.1 + 0.2}>
            <TechCard title={section.title} subtitle={section.subtitle} icon={<section.icon className="h-4 w-4 text-primary" />}>
               <div className="pt-2">
                  {section.component}
               </div>
            </TechCard>
          </MotionWrapper>
        ))}
      </div>
    </div>
  );
}
