"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { useAvailableTrucks } from "@/hooks";
import { cn } from "@/lib/utils";
import { TruckData } from "@/types/api";
import { useState } from "react";
import CreateNewTruckModal from "../modal/CreateNewTruckModal";

type truckComboboxProps = {
  value: string | undefined;
  onChange: (value: string) => void;
};

export function TruckCombobox({ value, onChange }: truckComboboxProps) {
  const [open, setOpen] = useState(false);
  const { data: trucks } = useAvailableTrucks();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {value
            ? trucks?.find((truck: TruckData) => truck.id === value)
                ?.license_plate
            : "Pilih truck..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cari truk..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              {" "}
              <div className="flex justify-center items-center flex-col gap-2">
                No truck found.
                <CreateNewTruckModal />
              </div>
            </CommandEmpty>
            <CommandGroup>
              {trucks?.map((truck: TruckData) => (
                <CommandItem
                  key={truck.id}
                  value={truck.license_plate.toLocaleLowerCase()}
                  onSelect={() => {
                    onChange(truck.id);
                    setOpen(false);
                  }}>
                  {truck.license_plate}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === truck.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
