"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { useCreateDelivery } from "@/hooks";
import {
  CreateDeliveryFormValues,
  createDeliverySchema,
} from "@/schemas/CreateDeliverySchema";
import { Plus } from "lucide-react";
import { TruckCombobox } from "../combobox/TruckCombobox";
import { RouteCombobox } from "../combobox/RouteCombobox";
import { DriverCombobox } from "../combobox/DriverCombobox";
import { toast } from "sonner";

const CreateDeliveryModal = () => {
  const [open, setOpen] = useState(false);
  const { mutate: createDelivery, isPending } = useCreateDelivery();

  const form = useForm<CreateDeliveryFormValues>({
    resolver: zodResolver(createDeliverySchema),
    defaultValues: {
      latitude: null,
      longitude: null,
      worker_id: "",
      route_id: "",
      truck_id: "",
    },
  });

  const onSubmit = (values: CreateDeliveryFormValues) => {
    createDelivery(
      {
        latitude: values.latitude ?? 0,
        longitude: values.longitude ?? 0,
        worker_id: values.worker_id,
        route_id: values.route_id,
        truck_id: values.truck_id,
      },
      {
        onSuccess: () => {
          toast.success("Pengiriman berhasil ditambahkan");
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Gagal menambahkan pengiriman";
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="default">
          <Plus className="h-4 w-4" />
          Tambah Pengiriman
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengiriman Truk</DialogTitle>
          <DialogDescription>
            Masukkan informasi pengiriman truk
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="truck_id"
              render={({ field }) => (
                <FormItem className="mb-4 grid w-full max-w-sm items-center gap-2">
                  <FormLabel htmlFor="folderId">Plat Truk</FormLabel>
                  <FormControl className="w-full">
                    <TruckCombobox
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <p className="text-sm text-red-400">
                    {form.formState.errors.truck_id?.message}
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="route_id"
              render={({ field }) => (
                <FormItem className="mb-4 grid w-full max-w-sm items-center gap-2">
                  <FormLabel htmlFor="folderId">Rute</FormLabel>
                  <FormControl className="w-full">
                    <RouteCombobox
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <p className="text-sm text-red-400">
                    {form.formState.errors.route_id?.message}
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="worker_id"
              render={({ field }) => (
                <FormItem className="mb-4 grid w-full max-w-sm items-center gap-2">
                  <FormLabel htmlFor="folderId">Driver</FormLabel>
                  <FormControl className="w-full">
                    <DriverCombobox
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <p className="text-sm text-red-400">
                    {form.formState.errors.route_id?.message}
                  </p>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menambahkan..." : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeliveryModal;
