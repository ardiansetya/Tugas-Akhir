"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateTransitPoint, useTransitPoint, useCity } from "@/hooks";
import {
  UpdateTransitPointFormValues,
  updateTransitPointSchema,
} from "@/schemas/UpdateTransitPointSchema";
import { Pencil } from "lucide-react";
import { CityCombobox } from "../combobox/CityCombobox";
import { toast } from "sonner";

const UpdateTransitPointModal = ({ transitPointId }: { transitPointId: number }) => {
  const [open, setOpen] = useState(false);
  const { data: transitPoint } = useTransitPoint(transitPointId, open);
  const { mutate: updateTransitPoint, isPending } = useUpdateTransitPoint();

  const form = useForm<UpdateTransitPointFormValues>({
    resolver: zodResolver(updateTransitPointSchema),
    defaultValues: {
      loading_city_id: 0,
      unloading_city_id: 0,
      estimated_duration_minute: 1,
      cargo_type: "",
      extra_cost: 0,
      is_active: true,
    },
  });

  // Watch city IDs to display city names
  const loadingCityId = form.watch("loading_city_id");
  const unloadingCityId = form.watch("unloading_city_id");

  // Get city data for preview
  const { data: loadingCity } = useCity(loadingCityId, loadingCityId > 0);
  const { data: unloadingCity } = useCity(unloadingCityId, unloadingCityId > 0);

  // Populate form when transit point data is loaded
  useEffect(() => {
    if (transitPoint && open) {
      form.reset({
        loading_city_id: transitPoint.loading_city_id,
        unloading_city_id: transitPoint.unloading_city_id,
        estimated_duration_minute: transitPoint.estimated_duration_minute,
        cargo_type: transitPoint.cargo_type,
        extra_cost: transitPoint.extra_cost,
        is_active: transitPoint.is_active,
      });
    }
  }, [transitPoint, open, form]);

  const onSubmit = (values: UpdateTransitPointFormValues) => {
    updateTransitPoint(
      {
        transitPointId,
        data: values,
      },
      {
        onSuccess: () => {
          toast.success("Transit point berhasil diperbarui");
          setOpen(false);
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Gagal memperbarui transit point";
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Transit Point</DialogTitle>
          <DialogDescription>
            Perbarui informasi transit point
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                {/* Loading City */}
                <FormField
                  control={form.control}
                  name="loading_city_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kota Muat</FormLabel>
                      <FormControl>
                        <CityCombobox
                          onChange={field.onChange}
                          value={field.value}
                          placeholder="Pilih kota Muat..."
                        />
                      </FormControl>
                      {form.formState.errors.loading_city_id && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.loading_city_id.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1">
                {/* Unloading City */}
                <FormField
                  control={form.control}
                  name="unloading_city_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kota Bongkar</FormLabel>
                      <FormControl>
                        <CityCombobox
                          onChange={field.onChange}
                          value={field.value}
                          placeholder="Pilih kota bongkar..."
                        />
                      </FormControl>
                      {form.formState.errors.unloading_city_id && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.unloading_city_id.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Route Preview */}
            {loadingCity && unloadingCity && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">
                  Rute: {loadingCity.name} → {unloadingCity.name}
                </p>
              </div>
            )}

            {/* Cargo Type */}
            <FormField
              control={form.control}
              name="cargo_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Kargo</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Pasir, Pakan, dll" {...field} />
                  </FormControl>
                  {form.formState.errors.cargo_type && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.cargo_type.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Estimated Duration */}
            <FormField
              control={form.control}
              name="estimated_duration_minute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durasi Estimasi (menit)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="60"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription>
                    Estimasi waktu transit dalam menit
                  </FormDescription>
                  {form.formState.errors.estimated_duration_minute && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.estimated_duration_minute.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Extra Cost */}
            <FormField
              control={form.control}
              name="extra_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biaya Tambahan (Rp)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription>
                    Biaya tambahan untuk transit point ini
                  </FormDescription>
                  {form.formState.errors.extra_cost && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.extra_cost.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Is Active */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300 mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Transit Point Aktif</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground">
                      Transit point ini dapat digunakan
                    </FormDescription>
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
                {isPending ? "Memperbarui..." : "Perbarui"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTransitPointModal;
