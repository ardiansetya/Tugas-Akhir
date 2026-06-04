import { useRoute } from "@/hooks";

interface RouteDetailProps {
  routeId: string;
}

export default function RouteDetail({ routeId }: RouteDetailProps) {
  const { data: route } = useRoute(routeId);
  if (!route) return <span className="text-sm font-medium">{routeId}</span>;
  return (
    <span className="text-sm font-medium">
      {route.start_city_name} → {route.end_city_name}
    </span>
  );
}
