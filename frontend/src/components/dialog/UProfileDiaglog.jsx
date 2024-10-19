import React, { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GenderSelection } from '@/pages/register/GenderSelection'
import { BirthdayField } from '@/pages/register/BirthdayField';
import { LocationSelection } from '@/pages/register/LocationSelection';
import { validations } from '@/validation/profile';
import { extractDateParts } from '@/utils/converDate';

const UProfileDialog = ({ props, onSubmit }) => {
    const [inputs, setInputs] = useState({
        full_name: props?.full_name || "",
        username: props?.username || "",
        gender: props?.gender ?? true,
        birthday: { day: "", month: "", year: "" },
        location: props?.location || "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [open, setOpen] = useState(false);

    const birthdayString = `${inputs.birthday.day}/${inputs.birthday.month}/${inputs.birthday.year}`;

    useEffect(() => {
        if (props?.birthday) {
            const { day, month, year } = extractDateParts(props.birthday);
            setInputs(prev => ({
                ...prev,
                birthday: { day, month, year }
            }));
        }
    }, [props]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.values(errors).every(error => !error)) {
            const hasChanged = checkForChanges();
            if (hasChanged) {
                onSubmit({ ...inputs, birthday: birthdayString });
                setOpen(false);
            }
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

    const checkForChanges = () => {
        return Object.keys(inputs).some(key => {
            if (key === 'birthday') {
                return birthdayString !== props.birthday;
            }
            return inputs[key] !== props[key];
        });
    };

    const handleInputChange = (key, value) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mt-4 w-full py-2 bg-black text-white rounded-[8px]">
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <InputField
                            id="full_name"
                            label="Full Name"
                            value={inputs.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            error={formErrors.full_name}
                        />
                        <InputField
                            id="username"
                            label="Username"
                            value={inputs.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            error={formErrors.username}
                        />
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
                        <LocationSelection
                            value={inputs.location}
                            onChange={(location) => handleInputChange('location', location)}
                            error={formErrors.location}
                        />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <DialogClose asChild>
                            <Button type="button" className="w-full py-2 bg-gray-200 text-black rounded-[8px]">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="w-full py-2 bg-black text-white rounded-[8px]">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const InputField = ({ id, label, value, onChange, error }) => (
    <div className="grid w-full items-center gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        <Input
            type="text"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            error={error}
        />
    </div>
);

export default UProfileDialog;
