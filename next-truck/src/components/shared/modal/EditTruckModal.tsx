"use client";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useTruck, useUpdateTruck } from "@/hooks";
import { editTruckSchema, EditTruckSchema } from "@/schemas/EditTruckSchema";
import { Pen } from "lucide-react";
import { toast } from "sonner";

const EditTruckModal = ({ truckId }: { truckId: string }) => {
  const [open, setOpen] = useState(false);
  const { data: truck } = useTruck(truckId);

  const { mutate: updateTruck, isPending } = useUpdateTruck();

  const form = useForm<EditTruckSchema>({
    resolver: zodResolver(editTruckSchema),
    defaultValues: {
      license_plate: "",
      model: "",
      cargo_type: "",
      capacity_kg: 0,
      is_available: true,
    },
  });

  const onSubmit = (values: EditTruckSchema) => {
    updateTruck(
      {
        data: {
          license_plate: values.license_plate,
          model: values.model,
          cargo_type: values.cargo_type,
          capacity_kg: values.capacity_kg,
          is_available: values.is_available,
        },
        truckId,
      },
      {
        onSuccess: () => {
          toast.success("Truk berhasil di-edit");
          setOpen(false);
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : "Gagal mengedit truk";
          toast.error(errorMessage);
        },
      }
    );
  };

  useEffect(() => {
    if (truck && open) {
      form.reset({
        license_plate: truck.license_plate || "",
        model: truck.model || "",
        cargo_type: truck.cargo_type || "",
        capacity_kg: truck.capacity_kg || 0,
        is_available: truck.is_available ?? true,
      });
    }
  }, [truck, open, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="default" className="flex-1">
          <Pen className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Truk </DialogTitle>
          <DialogDescription>
            Masukkan informasi truk baru untuk edit
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="license_plate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plat Nomor</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <p className="text-sm text-red-400">
                    {form.formState.errors.license_plate?.message}
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Truk</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <p className="text-sm text-red-400">
                    {form.formState.errors.model?.message}
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cargo_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Kargo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <p className="text-sm text-red-400">
                    {form.formState.errors.cargo_type?.message}
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity_kg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kapasitas (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <p className="text-sm text-red-400">
                    {form.formState.errors.capacity_kg?.message}
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Truk Tersedia</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit">{isPending ? "Loading..." : "Edit"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTruckModal;
