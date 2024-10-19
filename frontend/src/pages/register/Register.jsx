import React, { useState, useEffect } from 'react';
import logo from '@/assets/logo.png';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import useSignUp from '@/hooks/useSignUp';
import { validations } from '@/validation/register';
import { GenderSelection } from './GenderSelection';
import { BirthdayField } from './BirthdayField';
import { LocationSelection } from './LocationSelection';

const Register = () => {
    const { loading, signUp } = useSignUp();
    const [inputs, setInputs] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        gender: true,
        birthday: { day: "", month: "", year: "" },
        location: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const birthdayString = `${inputs.birthday.day}-${inputs.birthday.month}-${inputs.birthday.year}`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = Object.keys(inputs).reduce((acc, key) => {
            if (key === 'birthday') {
                acc.birthday = validations.birthday(birthdayString);
            } else if (validations[key]) {
                acc[key] = validations[key](inputs[key]);
            }
            return acc;
        }, {});

        setFormErrors(errors);

        if (Object.values(errors).every((error) => !error)) {
            console.log({ ...inputs, birthday: birthdayString })
            await signUp({ ...inputs, birthday: birthdayString});
        }
    };

    return (
        <div className='flex items-center justify-center'>
            <div className='w-full max-w-md bg-white rounded-lg border-[1px] border-[#D5D5D5] p-6 sm:p-8'>
                <div className="flex justify-center">
                    <img src={logo} className="h-14 w-auto sm:h-20" alt="LinguaConnect" />
                </div>
                <h2 className='text-2xl font-bold text-center mb-3'>Sign up to Lingua Connect</h2>

                <form onSubmit={handleSubmit} className="space-y-2">
                    {/* Full Name */}
                    <div>
                        <Input
                            type="text"
                            placeholder="Full Name"
                            value={inputs.full_name}
                            onChange={(e) => setInputs({ ...inputs, full_name: e.target.value })}
                            className="w-full"
                        />
                        {formErrors.full_name && <p className="text-red-500">{formErrors.full_name}</p>}
                    </div>

                    {/* Username and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Input
                                type="text"
                                placeholder="Username"
                                value={inputs.username}
                                onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                                className="w-full"
                            />
                            {formErrors.username && <p className="text-red-500">{formErrors.username}</p>}
                        </div>
                        <div>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={inputs.email}
                                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                                className="w-full"
                            />
                            {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
                        </div>
                    </div>

                    {/* Gender */}
                    <GenderSelection
                        gender={inputs.gender}
                        onChange={(newGender) => setInputs({ ...inputs, gender: newGender })}
                    />

                    {/* Birthday */}
                    <BirthdayField
                        day={inputs.birthday.day}
                        month={inputs.birthday.month}
                        year={inputs.birthday.year}
                        onChange={(newBirthday) => setInputs({ ...inputs, birthday: newBirthday })}
                        error={formErrors.birthday}
                    />

                    {/* Location */}
                    <LocationSelection
                        value={inputs.location}
                        onChange={(newLocation) => setInputs({ ...inputs, location: newLocation })}
                        error={formErrors.location}
                    />

                    {/* Password */}
                    <div className="space-y-2">
                        <div>
                            <Label htmlFor="password" className="block text-gray-700 font-medium mb-2 text-left">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={inputs.password}
                                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formErrors.password && <p className="text-red-500">{formErrors.password}</p>}
                        </div>
                    </div>

                    {/* Submit */}
                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
                        </Button>
                    </div>
                </form>

                {/* Google Button */}
                <div className="space-y-2 mt-2">
                    <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                        <FcGoogle className="text-xl" />
                        <span>Continue with Google</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Register;
