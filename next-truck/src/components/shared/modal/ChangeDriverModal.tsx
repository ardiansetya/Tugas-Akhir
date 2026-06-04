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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTakeoverDelivery, useDriverAvailable } from "@/hooks";
import {
  TakeoverDeliveryFormValues,
  takeoverDeliverySchema,
} from "@/schemas/TakeoverDeliverySchema";
import { Check, ChevronsUpDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserData } from "@/types/api";
import { useState, useEffect } from "react";

type ChangeDriverModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deliveryId: string;
  currentDriverId: string;
  currentDriverName?: string;
};

const ChangeDriverModal = ({
  open,
  onOpenChange,
  deliveryId,
  currentDriverId,
  currentDriverName,
}: ChangeDriverModalProps) => {
  const [driverOpen, setDriverOpen] = useState(false);

  const { mutate: takeoverDelivery, isPending } = useTakeoverDelivery();
  const { data: drivers = [], isLoading: driversLoading } =
    useDriverAvailable();

  const form = useForm<TakeoverDeliveryFormValues>({
    resolver: zodResolver(takeoverDeliverySchema),
    defaultValues: {
      delivery_id: deliveryId,
      from_worker_id: currentDriverId,
      to_worker_id: "",
      handover_at: Math.floor(Date.now() / 1000),
      reason: "",
    },
  });

  const onSubmit = (values: TakeoverDeliveryFormValues) => {
    takeoverDelivery(values, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  // Update form values when props change
  useEffect(() => {
    form.setValue("delivery_id", deliveryId);
    form.setValue("from_worker_id", currentDriverId);
    form.setValue("handover_at", Math.floor(Date.now() / 1000));
  }, [deliveryId, currentDriverId, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ganti Driver</DialogTitle>
          <DialogDescription>
            Ganti driver untuk pengiriman ini
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Driver Display */}
            <div className="space-y-2">
              <FormLabel>Driver Saat Ini</FormLabel>
              <div className="flex items-center gap-2 rounded-md border border-input bg-muted px-3 py-2 text-sm">
                <span className="font-medium">
                  {currentDriverName || "Loading..."}
                </span>
              </div>
            </div>

            {/* New Driver Selection */}
            <FormField
              control={form.control}
              name="to_worker_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Driver Baru</FormLabel>
                  <Popover open={driverOpen} onOpenChange={setDriverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}>
                          {field.value
                            ? drivers.find(
                                (driver: UserData) => driver.id === field.value
                              )?.username
                            : "Pilih driver baru"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Cari driver..." />
                        <CommandList>
                          <CommandEmpty>
                            {driversLoading
                              ? "Memuat driver..."
                              : "Driver tidak ditemukan."}
                          </CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {drivers
                              .filter(
                                (driver: UserData) =>
                                  driver.id !== currentDriverId
                              )
                              .map((driver: UserData) => (
                                <CommandItem
                                  value={driver.username.toLowerCase()}
                                  key={driver.id}
                                  onSelect={() => {
                                    form.setValue("to_worker_id", driver.id);
                                    setDriverOpen(false);
                                  }}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      driver.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {driver.username}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-red-400">
                    {form.formState.errors.to_worker_id?.message}
                  </p>
                </FormItem>
              )}
            />

            {/* Reason Field */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan Pergantian</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contoh: Driver sebelumnya sakit, perlu pergantian mendesak"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-red-400">
                    {form.formState.errors.reason?.message}
                  </p>
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
                {isPending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Mengganti...
                  </>
                ) : (
                  "Ganti Driver"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeDriverModal;
