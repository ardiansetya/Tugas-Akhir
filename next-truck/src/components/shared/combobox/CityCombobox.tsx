"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
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
import { useCities } from "@/hooks";
import { cn } from "@/lib/utils";
import type { CityData } from "@/hooks/useCity";

type CityComboboxProps = {
  value: number | undefined;
  onChange: (value: number) => void;
  placeholder?: string;
};

export function CityCombobox({ value, onChange, placeholder = "Pilih kota..." }: CityComboboxProps) {
  const [open, setOpen] = useState(false);
  const { data: cities } = useCities();

  const selectedCity = cities?.find((c: CityData) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {selectedCity ? selectedCity.name : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cari kota..." className="h-9" />
          <CommandList>
            <CommandEmpty>Kota tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {cities?.map((c: CityData) => (
                <CommandItem
                  key={c.id}
                  value={c.name.toLowerCase()}
                  onSelect={() => {
                    onChange(c.id);
                    setOpen(false);
                  }}>
                  {c.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === c.id ? "opacity-100" : "opacity-0"
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
