import { useCity } from "@/hooks";

interface CityCellProps {
  cityId: number;
}

export default function CityCell({ cityId }: CityCellProps) {
  const { data: city } = useCity(cityId, true);

  if (!city) {
    return <span className="text-muted-foreground text-sm">ID {cityId}</span>;
  }

  return (
    <div>
      <p className="text-sm font-medium">{city.name}</p>
      <p className="text-xs text-muted-foreground">{city.country}</p>
    </div>
  );
}
