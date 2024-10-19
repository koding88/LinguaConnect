import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import countries from '@/utils/countries';
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { getFlagImage } from "@/utils/flag";

export const LocationSelection = ({ value, onChange, error }) => {
    const [open, setOpen] = useState(false);

    const selectedCountry = countries.find((country) => country.code === value);

    return (
        <div className="space-y-2">
            <Label htmlFor="location" className="block text-gray-700 font-medium mb-2 text-left">
                Location
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value ? (
                            <div className="flex items-center">
                                <img
                                    src={getFlagImage(value)}
                                    width="20"
                                    alt={selectedCountry?.name}
                                    className="mr-2"
                                />
                                {selectedCountry?.name}
                            </div>
                        ) : "Select a country..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search country..." />
                        <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                {countries.map((country) => (
                                    <CommandItem
                                        key={country.code}
                                        value={country.name}
                                        onSelect={() => {
                                            onChange(country.code);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === country.code ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <img
                                            src={getFlagImage(country.code)}
                                            width="20"
                                            alt={country.name}
                                            className="mr-2"
                                        />
                                        {country.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};
