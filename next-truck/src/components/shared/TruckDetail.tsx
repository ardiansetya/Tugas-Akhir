import { useTruck } from "@/hooks";

interface TruckDetailProps {
  truckId: string;
}

export default function TruckDetail({ truckId }: TruckDetailProps) {
  const { data: truck } = useTruck(truckId);
  return (
    <span className="text-sm font-medium">
      {truck?.license_plate || truckId}
    </span>
  );
}
