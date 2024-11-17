import { Label } from "@/components/ui/label";
import { Cake } from "lucide-react";

export const BirthdayField = ({ day, month, year, onChange, error, state }) => {
    const currentYear = new Date().getFullYear();

    const getSelectClassName = () => {
        const baseClass = "w-full h-[42px] px-2.5 py-1.5 bg-white border-2 rounded-lg text-xs sm:text-sm transition-all duration-200";
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
                <Cake className="w-4 h-4 text-blue-600" />
                Birthday
            </Label>
            <div className="grid grid-cols-3 gap-2">
                {['day', 'month', 'year'].map((field) => (
                    <select
                        key={field}
                        value={field === 'day' ? day : field === 'month' ? month : year}
                        required
                        onChange={(e) => onChange({ ...{ day, month, year }, [field]: e.target.value })}
                        className={getSelectClassName()}
                    >
                        <option value="">{field.charAt(0).toUpperCase() + field.slice(1)}</option>
                        {field === 'year'
                            ? [...Array(currentYear - 1984)].map((_, i) => (
                                <option key={currentYear - i} value={currentYear - i}>
                                    {currentYear - i}
                                </option>
                            ))
                            : [...Array(field === 'day' ? 31 : 12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))
                        }
                    </select>
                ))}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};
