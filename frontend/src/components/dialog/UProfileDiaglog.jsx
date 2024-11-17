import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GenderSelection } from '@/pages/register/GenderSelection'
import { BirthdayField } from '@/pages/register/BirthdayField';
import { LocationSelection } from '@/pages/register/LocationSelection';
import { validations } from '@/validation/profile';
import { extractDateParts } from '@/utils/converDate';
import { FavoriteTopics } from '@/pages/register/FavoriteTopics';
import {
    PenSquare,
    User,
    AtSign,
    Heart,
    Save,
    X,
} from 'lucide-react';

const UProfileDialog = ({ props, onSubmit, trigger }) => {
    const [inputs, setInputs] = useState({
        full_name: props?.full_name || "",
        username: props?.username || "",
        gender: props?.gender ?? true,
        birthday: { day: "", month: "", year: "" },
        location: props?.location || "",
        favoriteTopics: props?.favoriteTopics || [],
    });

    const [formErrors, setFormErrors] = useState({});
    const [open, setOpen] = useState(false);

    const birthdayString = inputs.birthday.day && inputs.birthday.month && inputs.birthday.year
        ? `${inputs.birthday.month}-${inputs.birthday.day}-${inputs.birthday.year}`
        : props?.birthday || "";

    useEffect(() => {
        if (props) {
            setInputs(prev => ({
                ...prev,
                full_name: props.full_name || "",
                username: props.username || "",
                gender: props.gender ?? true,
                location: props.location || "",
                favoriteTopics: Array.isArray(props.favoriteTopics) ? [...props.favoriteTopics] : [],
            }));
        }
    }, [props]);

    useEffect(() => {
        if (props?.birthday) {
            const { day, month, year } = extractDateParts(props.birthday);
            setInputs(prev => ({
                ...prev,
                birthday: { day, month, year }
            }));
        }
    }, [props?.birthday]);

    const toggleTopic = (topicId) => {
        setInputs(prev => {
            const newTopics = prev.favoriteTopics.includes(topicId)
                ? prev.favoriteTopics.filter(id => id !== topicId)
                : [...prev.favoriteTopics, topicId];
            return {
                ...prev,
                favoriteTopics: newTopics
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.values(errors).every(error => !error)) {
            const submitData = {
                full_name: inputs.full_name,
                username: inputs.username,
                gender: inputs.gender,
                birthday: birthdayString,
                location: inputs.location,
                favoriteTopics: [...inputs.favoriteTopics]
            };

            console.log('Submitting data:', submitData);
            onSubmit(submitData);
            setOpen(false);
        }
    };

    const validateForm = () => {
        return Object.keys(inputs).reduce((acc, key) => {
            if (key === 'birthday') {
                acc.birthday = validations.birthday(birthdayString);
            } else if (validations[key]) {
                acc[key] = validations[key](inputs[key]);
            }
            return acc;
        }, {});
    };

    const handleInputChange = (key, value) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="mt-2.5 w-full py-1.25 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-md hover:translate-y-[-0.85px] active:translate-y-0 transition-all">
                        <PenSquare className="w-3.5 h-3.5 mr-1.5" />
                        Edit Profile
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-[765px] p-3.5 sm:p-4.25 overflow-y-auto max-h-[72vh] lg:overflow-visible lg:max-h-none">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Edit Your Profile
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4.25 mt-2.5">
                        {/* Cột trái */}
                        <div className="flex flex-col h-full">
                            <div className="flex flex-col items-center mb-5">
                                <div className="relative">
                                    <img
                                        src={props?.avatarUrl}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-xl border-3.5 border-white shadow-md"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3.5 flex-1">
                                <div className="space-y-2.5">
                                    <InputField
                                        id="full_name"
                                        label="Full Name"
                                        icon={<User className="w-3.5 h-3.5 text-gray-500" />}
                                        value={inputs.full_name}
                                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                                        error={formErrors.full_name}
                                    />
                                    <InputField
                                        id="username"
                                        label="Username"
                                        icon={<AtSign className="w-3.5 h-3.5 text-gray-500" />}
                                        value={inputs.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        error={formErrors.username}
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <div className="bg-gray-50/50 p-3.5 rounded-lg space-y-2.5">
                                        <GenderSelection
                                            gender={inputs.gender}
                                            onChange={(gender) => handleInputChange('gender', gender)}
                                            error={formErrors.gender}
                                        />
                                        <BirthdayField
                                            day={inputs.birthday.day}
                                            month={inputs.birthday.month}
                                            year={inputs.birthday.year}
                                            onChange={(birthday) => handleInputChange('birthday', birthday)}
                                            error={formErrors.birthday}
                                        />
                                    </div>
                                </div>

                                <LocationSelection
                                    value={inputs.location}
                                    onChange={(location) => handleInputChange('location', location)}
                                    error={formErrors.location}
                                />
                            </div>
                        </div>

                        {/* Cột phải */}
                        <div className="flex flex-col h-full">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3.5 flex-1">
                                <h3 className="text-sm font-semibold mb-2.5 flex items-center gap-1.5">
                                    <Heart className="w-4.25 h-4.25 text-blue-600" />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                        Your Interests
                                    </span>
                                </h3>
                                <FavoriteTopics
                                    selectedTopics={inputs.favoriteTopics}
                                    toggleTopic={toggleTopic}
                                    className="h-[400px] sm:h-[400px]"
                                    otherClassName="h-[390px] sm:h-[390px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2.5 mt-5 pt-3.5 border-t border-gray-100">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 h-8.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-3.5 h-3.5 mr-1.5" />
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="flex-1 h-8.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md hover:translate-y-[-0.85px] active:translate-y-0 transition-all"
                        >
                            <Save className="w-3.5 h-3.5 mr-1.5" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Helper component cho Input fields với icon
const InputField = ({ id, label, icon, value, onChange, error }) => (
    <div className="space-y-1.25">
        <Label htmlFor={id} className="text-xs font-medium flex items-center gap-1.5">
            {icon}
            {label}
        </Label>
        <Input
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            className={`h-8.5 text-xs bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                error ? 'border-red-500' : ''
            }`}
        />
        {error && (
            <p className="text-red-500 text-[10px] mt-0.85 flex items-center gap-0.85">
                <X className="w-2.5 h-2.5" />
                {error}
            </p>
        )}
    </div>
);

export default UProfileDialog;
