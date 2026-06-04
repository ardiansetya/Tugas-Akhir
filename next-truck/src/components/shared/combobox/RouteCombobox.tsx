"use client";

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
import { useRoutes } from "@/hooks";
import { cn } from "@/lib/utils";
import { RouteData } from "@/types/api";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import CreateRouteModal from "../modal/CreateRouteModal";

type RouteComboboxProps = {
  value: string | undefined;
  onChange: (value: string) => void;
};

export function RouteCombobox({ value, onChange }: RouteComboboxProps) {
  const [open, setOpen] = useState(false);
  const { data: routes } = useRoutes();

  const selectedRoute = routes?.find((r: RouteData) => r.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {selectedRoute
            ? `${selectedRoute.start_city_name} → ${selectedRoute.end_city_name}`
            : "Pilih route..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cari route..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              <p className="flex flex-col justify-center items-center mb-2">
                Route tidak ditemukan.
              </p>
              <CreateRouteModal buttonVariant="outline" />
            </CommandEmpty>
            <CommandGroup>
              {routes?.map((r: RouteData) => {
                const routeLabel = `${r.start_city_name} → ${r.end_city_name}`;
                return (
                  <CommandItem
                    key={r.id}
                    value={routeLabel.toLowerCase()}
                    onSelect={() => {
                      onChange(r.id);
                      setOpen(false);
                    }}>
                    {routeLabel}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === r.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
