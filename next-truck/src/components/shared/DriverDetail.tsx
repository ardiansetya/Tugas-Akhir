import { useUser } from "@/hooks";

interface DriverDetailProps {
  driverId: string;
}

export default function DriverDetail({ driverId }: DriverDetailProps) {
  const { data: driver } = useUser(driverId);
  return (
    <span className="text-sm font-medium">{driver?.username || driverId}</span>
  );
}
