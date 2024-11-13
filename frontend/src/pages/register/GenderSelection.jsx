import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";

export const GenderSelection = ({ gender, onChange }) => (
    <div className="space-y-1.5">
        <Label className="text-sm font-medium">Gender</Label>
        <div className="flex gap-3">
            {['Male', 'Female'].map((label, idx) => (
                <div key={label} className="flex-1">
                    <label
                        htmlFor={label.toLowerCase()}
                        className={`flex items-center justify-between w-full p-2.5 border rounded-lg cursor-pointer transition-all
                                ${gender === (idx === 0)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <span className="text-sm font-medium">{label}</span>
                        <Input
                            type="radio"
                            id={label.toLowerCase()}
                            value={idx === 0}
                            checked={gender === (idx === 0)}
                            onChange={() => onChange(idx === 0)}
                            className="h-4 w-4 text-blue-600"
                        />
                    </label>
                </div>
            ))}
        </div>
    </div>
);
