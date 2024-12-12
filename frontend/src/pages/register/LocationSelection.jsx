import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import countries from '@/utils/countries';
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFlagImage } from "@/utils/flag";

export const LocationSelection = ({ value, onChange, error, state }) => {
    const [open, setOpen] = useState(false);

    const selectedCountry = countries.find((country) => country.code === value);

    const getButtonClassName = () => {
        const baseClass = "w-full justify-between transition-all duration-200 border-2";
        if (state === 'error') {
            return `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`;
        }
        if (state === 'success') {
            return `${baseClass} border-green-500 focus:border-green-500 focus:ring-green-500`;
        }
        return `${baseClass} border-gray-200 hover:border-gray-300`;
    };

    return (
        <div className="space-y-1.5">
            <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Location
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={getButtonClassName()}
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
                    <Command className="w-full">
                        <CommandInput placeholder="Search country..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                <ScrollArea className="h-[200px]">
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
                                </ScrollArea>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};
