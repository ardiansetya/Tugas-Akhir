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
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useCreateTruck } from "@/hooks";
import {
  CreateTruckFormValues,
  createTruckSchema,
} from "@/schemas/CreateTruckSchema";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const CreateNewTruckModal = () => {
  const [open, setOpen] = useState(false);
  const { mutate: createTruck, isPending } = useCreateTruck();

  const form = useForm<CreateTruckFormValues>({
    resolver: zodResolver(createTruckSchema),
    defaultValues: {
      license_plate: "",
      model: "",
      cargo_type: "",
      capacity_kg: 0,
      is_available: true,
    },
  });

  const onSubmit = (values: CreateTruckFormValues) => {
    createTruck(values, {
      onSuccess: () => {
        toast.success("Truk berhasil ditambahkan");
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error ? error.message : "Gagal menambahkan truk";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="default">
          <Plus className="h-4 w-4" />
          Tambah Truk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Truk Baru</DialogTitle>
          <DialogDescription>Masukkan informasi truk baru</DialogDescription>
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
                    <Input placeholder="Contoh: B 1234 XYZ" {...field} />
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
                    <Input
                      placeholder="Contoh: Mitsubishi Colt Diesel"
                      {...field}
                    />
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
                    <Input placeholder="Contoh: General" {...field} />
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
                      placeholder="Contoh: 5000"
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
                    <input
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

export default CreateNewTruckModal;
