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
import { useDriverAvailable, useUsers } from "@/hooks";
import { cn } from "@/lib/utils";
import { UserData } from "@/types/api";
import { useState } from "react";
import CreateUserModal from "../modal/CreateUserModal";

type DriverComboboxProps = {
  value: string | undefined;
  onChange: (value: string) => void;
};

export function DriverCombobox({ value, onChange }: DriverComboboxProps) {
  const [open, setOpen] = useState(false);
  const { data: drivers } = useDriverAvailable();
  console.log(drivers);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {value
            ? drivers?.find((driver: UserData) => driver.id === value)?.username
            : "Pilih driver..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cari driver..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              <div className="flex justify-center items-center flex-col gap-2">
                No driver found.
                <CreateUserModal />
              </div>
            </CommandEmpty>
            <CommandGroup>
              {drivers?.map((driver: UserData) => (
                <CommandItem
                  key={driver.id}
                  value={driver.username.toLocaleLowerCase()}
                  onSelect={() => {
                    onChange(driver.id);
                    setOpen(false);
                  }}>
                  {driver.username}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === driver.id ? "opacity-100" : "opacity-0",
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
