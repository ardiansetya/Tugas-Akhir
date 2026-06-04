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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useUpdateRoute, useCities, useRoute } from "@/hooks";
import {
  UpdateRouteFormValues,
  updateRouteSchema,
} from "@/schemas/UpdateRouteSchema";
import { Pencil, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const UpdateRouteModal = ({ routeId }: { routeId: string }) => {
  const [open, setOpen] = useState(false);
  const [startCityOpen, setStartCityOpen] = useState(false);
  const [endCityOpen, setEndCityOpen] = useState(false);

  const { data: route } = useRoute(routeId, open);
  const { mutate: updateRoute, isPending } = useUpdateRoute();
  const { data: cities = [], isLoading: citiesLoading } = useCities();

  const form = useForm<UpdateRouteFormValues>({
    resolver: zodResolver(updateRouteSchema),
    defaultValues: {
      start_city_id: "",
      end_city_id: "",
      details: "",
      cargo_type: "",
      base_price: 0,
      distance_km: 0,
      estimated_duration_hours: 0,
      is_active: true,
    },
  });

  // Populate form when route data is loaded
  useEffect(() => {
    if (route && open) {
      // Find city IDs from city names
      const startCity = cities.find((city) => city.name === route.start_city_name);
      const endCity = cities.find((city) => city.name === route.end_city_name);

      form.reset({
        start_city_id: startCity ? String(startCity.id) : "",
        end_city_id: endCity ? String(endCity.id) : "",
        details: route.details || "",
        cargo_type: route.cargo_type || "",
        base_price: route.base_price || 0,
        distance_km: route.distance_km || 0,
        estimated_duration_hours: route.estimated_duration_hours || 0,
        is_active: route.is_active ?? true,
      });
    }
  }, [route, cities, open, form]);

  const onSubmit = (values: UpdateRouteFormValues) => {
    updateRoute(
      {
        routeId,
        data: values,
      },
      {
        onSuccess: () => {
          toast.success("Rute berhasil diperbarui");
          setOpen(false);
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : "Gagal memperbarui rute";
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
          <DialogTitle>Edit Rute</DialogTitle>
          <DialogDescription>
            Perbarui informasi rute pengiriman
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_city_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kota Asal</FormLabel>
                    <Popover open={startCityOpen} onOpenChange={setStartCityOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? cities.find((city) => String(city.id) === field.value)?.name
                              : "Pilih kota asal"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Cari kota..." />
                          <CommandEmpty>
                            {citiesLoading ? "Memuat kota..." : "Kota tidak ditemukan."}
                          </CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {cities.map((city) => (
                              <CommandItem
                                value={city.name}
                                key={city.id}
                                onSelect={() => {
                                  form.setValue("start_city_id", String(city.id));
                                  setStartCityOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    String(city.id) === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {city.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <p className="text-sm text-red-400">
                      {form.formState.errors.start_city_id?.message}
                    </p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_city_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kota Tujuan</FormLabel>
                    <Popover open={endCityOpen} onOpenChange={setEndCityOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? cities.find((city) => String(city.id) === field.value)?.name
                              : "Pilih kota tujuan"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Cari kota..." />
                          <CommandEmpty>
                            {citiesLoading ? "Memuat kota..." : "Kota tidak ditemukan."}
                          </CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {cities.map((city) => (
                              <CommandItem
                                value={city.name}
                                key={city.id}
                                onSelect={() => {
                                  form.setValue("end_city_id", String(city.id));
                                  setEndCityOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    String(city.id) === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {city.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <p className="text-sm text-red-400">
                      {form.formState.errors.end_city_id?.message}
                    </p>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail Rute</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contoh: Jalur tol Cipularang, estimasi waktu tempuh normal"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-red-400">
                    {form.formState.errors.details?.message}
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="distance_km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jarak (KM)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="150"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <p className="text-sm text-red-400">
                      {form.formState.errors.distance_km?.message}
                    </p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimated_duration_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimasi (Jam)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="3"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <p className="text-sm text-red-400">
                      {form.formState.errors.estimated_duration_hours?.message}
                    </p>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="base_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Dasar (Rp)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2500000"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      value={field.value || ""}
                    />
                  </FormControl>
                  <p className="text-sm text-red-400">
                    {form.formState.errors.base_price?.message}
                  </p>
                </FormItem>
              )}
            />
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
                    <FormLabel>Rute Aktif</FormLabel>
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

export default UpdateRouteModal;
