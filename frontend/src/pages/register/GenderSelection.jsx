import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";

export const GenderSelection = ({ gender, onChange }) => (
    <div className="space-y-2">
        <Label htmlFor="gender" className="block text-sm font-medium text-gray-700 text-left">Gender</Label>
        <div className="flex gap-4">
            {['Male', 'Female'].map((label, idx) => (
                <div key={label} className="flex-1">
                    <label
                        htmlFor={label.toLowerCase()}
                        className="flex items-center justify-between w-full p-3 border rounded-lg cursor-pointer hover:border-gray-400"
                    >
                        <span className="text-sm font-medium">{label}</span>
                        <Input
                            type="radio"
                            id={label.toLowerCase()}
                            value={idx === 0}
                            checked={gender === (idx === 0)}
                            onChange={() => onChange(idx === 0)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                    </label>
                </div>
            ))}
        </div>
    </div>
);
