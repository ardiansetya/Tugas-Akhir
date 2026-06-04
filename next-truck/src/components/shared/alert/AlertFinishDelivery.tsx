"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { useFinishDelivery } from "@/hooks";
import type { FinishDeliverySchema } from "@/schemas/FinishDeliverySchema";
import { Check } from "lucide-react";
import { toast } from "sonner";

const AlertFinishDelivery = ({ delivery }: { delivery: FinishDeliverySchema }) => {
  const { mutate, isPending } = useFinishDelivery(delivery.id);

 

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"default"} size={"sm"} className="flex-1">
          <Check className="text-white" /> Selesai
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Ini akan menyelesaikan pengiriman driver
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate()}>
            {isPending ? "Loading..." : "Selesai"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertFinishDelivery;
