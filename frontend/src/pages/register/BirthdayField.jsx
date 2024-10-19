import { Label } from "@/components/ui/label";
import React from "react";

export const BirthdayField = ({ day, month, year, onChange, error }) => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="space-y-2">
            <Label className="block text-gray-700 font-medium mb-2 text-left">Birthday</Label>
            <div className="grid grid-cols-3 gap-4">
                {['day', 'month', 'year'].map((field) => (
                    <div key={field}>
                        <select
                            value={field === 'day' ? day : field === 'month' ? month : year}
                            required
                            onChange={(e) => onChange({ ...{ day, month, year }, [field]: e.target.value })}
                            className="w-full border rounded-lg px-4 py-2"
                        >
                            <option value="">{field.charAt(0).toUpperCase() + field.slice(1)}</option>
                            {field === 'year'
                                ? [...Array(currentYear - 1984)].map((_, i) => (
                                    <option key={currentYear - i} value={currentYear - i}>{currentYear - i}</option>
                                ))
                                : [...Array(field === 'day' ? 31 : 12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))
                            }
                        </select>
                    </div>
                ))}
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};
