import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, MapPin } from "lucide-react";

interface TransitDriverEmptyStateProps {
  type: "error" | "empty";
}

export default function TransitDriverEmptyState({
  type,
}: TransitDriverEmptyStateProps) {
  if (type === "error") {
    return (
      <Card className="py-12">
        <CardContent className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Terjadi Kesalahan</h3>
          <p className="text-muted-foreground">
            Gagal memuat data transit. Silakan coba lagi.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-12">
      <CardContent className="text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Tidak ada data transit</h3>
        <p className="text-muted-foreground">
          Tidak ada transit yang sesuai dengan pencarian Anda
        </p>
      </CardContent>
    </Card>
  );
}
