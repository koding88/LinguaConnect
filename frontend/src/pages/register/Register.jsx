import React, { useState, useEffect } from 'react';
import logo from '@/assets/logo.png';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import useSignUp from '@/hooks/useSignUp';
import { validations } from '@/validation/register';
import { GenderSelection } from './GenderSelection';
import { BirthdayField } from './BirthdayField';
import { LocationSelection } from './LocationSelection';
import { FavoriteTopics } from './FavoriteTopics';

const Register = () => {
    const { loading, signUp } = useSignUp();
    const [inputs, setInputs] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        gender: true,
        favoriteTopics: [],
        birthday: { day: "", month: "", year: "" },
        location: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const birthdayString = `${inputs.birthday.day}-${inputs.birthday.month}-${inputs.birthday.year}`;

    const [touchedFields, setTouchedFields] = useState({
        full_name: false,
        username: false,
        email: false,
        password: false,
        birthday: false,
        location: false,
    });

    useEffect(() => {
        const validateField = (field) => {
            if (!touchedFields[field]) return;

            if (field === 'birthday') {
                setFormErrors(prev => ({
                    ...prev,
                    [field]: validations.birthday(birthdayString)
                }));
            } else if (validations[field]) {
                setFormErrors(prev => ({
                    ...prev,
                    [field]: validations[field](inputs[field])
                }));
            }
        };

        Object.keys(touchedFields).forEach(validateField);
    }, [inputs, touchedFields, birthdayString]);

    const getInputState = (fieldName) => {
        if (!touchedFields[fieldName]) return '';
        return formErrors[fieldName] ? 'error' : 'success';
    };

    const getInputClassName = (fieldName) => {
        const state = getInputState(fieldName);
        return `h-10 transition-all duration-200 ${state === 'error'
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : state === 'success'
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-200'
            }`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setTouchedFields(Object.keys(touchedFields).reduce((acc, field) => ({
            ...acc,
            [field]: true
        }), {}));

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
            await signUp({ ...inputs, birthday: birthdayString });
        }
    };

    const toggleTopic = (topic) => {
        setInputs(prev => ({
            ...prev,
            favoriteTopics: prev.favoriteTopics.includes(topic)
                ? prev.favoriteTopics.filter(t => t !== topic)
                : [...prev.favoriteTopics, topic]
        }));
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <div className='w-full max-w-[1020px] bg-white rounded-lg shadow-sm border border-gray-100
                            p-4 sm:p-5 lg:p-6 transition-all duration-300'>
                {/* Header */}
                <div className="flex flex-col items-center mb-5">
                    <img src={logo} className="h-10 sm:h-12 w-auto" alt="LinguaConnect" />
                    <h2 className='text-lg sm:text-xl font-bold mt-2.5 text-gray-800'>Sign up to Lingua Connect</h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Connect with language learners worldwide</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <div className="space-y-3">
                        {/* Full Name & Username */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
                                <Input
                                    id="full_name"
                                    type="text"
                                    placeholder="Enter full name"
                                    value={inputs.full_name}
                                    onChange={(e) => setInputs({ ...inputs, full_name: e.target.value })}
                                    onBlur={() => setTouchedFields(prev => ({ ...prev, full_name: true }))}
                                    className={getInputClassName('full_name')}
                                />
                                {touchedFields.full_name && formErrors.full_name && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.full_name}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Choose username"
                                    value={inputs.username}
                                    onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                                    onBlur={() => setTouchedFields(prev => ({ ...prev, username: true }))}
                                    className={getInputClassName('username')}
                                />
                                {touchedFields.username && formErrors.username && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
                                )}
                            </div>
                        </div>

                        {/* Email & Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter email"
                                    value={inputs.email}
                                    onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                                    onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))}
                                    className={getInputClassName('email')}
                                />
                                {touchedFields.email && formErrors.email && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    placeholder="Enter password"
                                    value={inputs.password}
                                    onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                    onBlur={() => setTouchedFields(prev => ({ ...prev, password: true }))}
                                    className={getInputClassName('password')}
                                />
                                {touchedFields.password && formErrors.password && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Gender & Birthday */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <GenderSelection
                                gender={inputs.gender}
                                onChange={(newGender) => setInputs({ ...inputs, gender: newGender })}
                            />
                            <BirthdayField
                                day={inputs.birthday.day}
                                month={inputs.birthday.month}
                                year={inputs.birthday.year}
                                onChange={(newBirthday) => {
                                    setInputs({ ...inputs, birthday: newBirthday });
                                    setTouchedFields(prev => ({ ...prev, birthday: true }));
                                }}
                                error={touchedFields.birthday ? formErrors.birthday : null}
                                state={getInputState('birthday')}
                            />
                        </div>

                        {/* Location */}
                        <LocationSelection
                            value={inputs.location}
                            onChange={(newLocation) => {
                                setInputs({ ...inputs, location: newLocation });
                                setTouchedFields(prev => ({ ...prev, location: true }));
                            }}
                            error={touchedFields.location ? formErrors.location : null}
                            state={getInputState('location')}
                        />
                    </div>


                    <div className="space-y-3">
                        <FavoriteTopics
                            selectedTopics={inputs.favoriteTopics}
                            toggleTopic={toggleTopic}
                            className='h-[290px]'
                        />
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 space-y-2.5">
                        <Button
                            type="submit"
                            className="w-full h-9 sm:h-10 text-sm sm:text-base font-medium"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className='loading loading-spinner'></span>
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full h-9 sm:h-10 text-sm sm:text-base font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
                        >
                            <FcGoogle className="text-lg sm:text-xl" />
                            <span>Continue with Google</span>
                        </Button>

                        <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-600 hover:underline">
                                Sign in
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
