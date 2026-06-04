import { Card, CardContent } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function TruckEmptyState() {
  return (
    <Card className="py-12">
      <CardContent className="text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Truck className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Tidak ada truck</h3>
        <p className="text-muted-foreground">
          Tidak ada truck yang sesuai dengan pencarian Anda
        </p>
      </CardContent>
    </Card>
  );
}
