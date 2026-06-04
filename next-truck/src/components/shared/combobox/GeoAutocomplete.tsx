"use client";

import { Check, ChevronsUpDown, Loader2, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
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
import { useGeoAutocomplete } from "@/hooks/useGeo";
import { cn } from "@/lib/utils";

type GeoAutocompleteProps = {
  value: string | undefined;
  onChange: (value: string, display_name: string) => void;
  placeholder?: string;
};

export function GeoAutocomplete({ value, onChange, placeholder = "Cari alamat..." }: GeoAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [search]);

  const { data: results, isLoading } = useGeoAutocomplete(debouncedSearch, open);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto py-2 px-3 text-left">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">{value ? value : placeholder}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Ketik alamat..." 
            value={search}
            onValueChange={setSearch}
            className="h-9" 
          />
          <CommandList>
            {isLoading && (
              <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Mencari alamat...
              </div>
            )}
            
            {!isLoading && debouncedSearch.length > 2 && results?.length === 0 && (
              <CommandEmpty>Alamat tidak ditemukan.</CommandEmpty>
            )}

            {!isLoading && debouncedSearch.length <= 2 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Ketik minimal 3 karakter...
              </div>
            )}

            <CommandGroup>
              {results?.map((res, index) => (
                <CommandItem
                  key={index}
                  value={res.display_name}
                  onSelect={() => {
                    onChange(`${res.lat},${res.lon}`, res.display_name);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start gap-1 py-3 px-4">
                  <div className="flex items-center w-full">
                    <span className="font-medium text-sm">{res.address.name || res.address.road || "Alamat Terdeteksi"}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === res.display_name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    {res.display_name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
