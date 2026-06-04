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
import { useDeleteDelivery } from "@/hooks";
import type { DeleteDeliverySchema } from "@/schemas/DeleteDeliverySchema";
import { Trash2Icon } from "lucide-react";

const AlertDeleteDelivery = ({ delivery }: { delivery: DeleteDeliverySchema }) => {
  const { mutate, isPending } = useDeleteDelivery();

  const onSubmit = (delivery: DeleteDeliverySchema) => {
    mutate(delivery.id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"sm"} className="flex-1">
          <Trash2Icon className="text-white" /> Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Ini akan menghapus data pengiriman secara permanen
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-500"
            onClick={() => onSubmit(delivery)}>
            {isPending ? "Loading..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDeleteDelivery;
