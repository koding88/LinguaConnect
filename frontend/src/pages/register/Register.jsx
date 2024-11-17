import React, { useState, useEffect } from 'react';
import logo from '@/assets/logo.png';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { 
    User, 
    AtSign, 
    Mail, 
    Lock, 
    MapPin, 
    Cake,
    UserCircle2,
    Hash
} from "lucide-react";
import useSignUp from '@/hooks/useSignUp';
import { validations } from '@/validation/register';
import { GenderSelection } from './GenderSelection';
import { BirthdayField } from './BirthdayField';
import { LocationSelection } from './LocationSelection';
import { FavoriteTopics } from './FavoriteTopics';

const Register = () => {
    const { loading, signUp } = useSignUp();
    const googleUrl = `${import.meta.env.VITE_API_BACKEND_URL}/api/v1/auth/google` 
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
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50'>
            <div className='w-full max-w-[1020px] bg-white rounded-2xl shadow-xl border border-gray-100
                            p-4 sm:p-5 lg:p-6 transition-all duration-300'>
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <img src={logo} className="h-12 sm:h-14 w-auto" alt="LinguaConnect" />
                    <h2 className='text-xl sm:text-2xl font-bold mt-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600'>
                        Sign up to Lingua Connect
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base mt-1.5">Connect with language learners worldwide</p>
                </div>

                {/* Tách form và Google button thành 2 phần riêng biệt */}
                <div className="space-y-3">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        <div className="space-y-4">
                            {/* Full Name & Username */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="full_name" className="text-sm font-medium flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-600" />
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="full_name"
                                            type="text"
                                            placeholder="Enter full name"
                                            value={inputs.full_name}
                                            onChange={(e) => setInputs({ ...inputs, full_name: e.target.value })}
                                            onBlur={() => setTouchedFields(prev => ({ ...prev, full_name: true }))}
                                            className={`pl-10 ${getInputClassName('full_name')}`}
                                        />
                                        <UserCircle2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {touchedFields.full_name && formErrors.full_name && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.full_name}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                                        <AtSign className="w-4 h-4 text-blue-600" />
                                        Username
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Choose username"
                                            value={inputs.username}
                                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                                            onBlur={() => setTouchedFields(prev => ({ ...prev, username: true }))}
                                            className={`pl-10 ${getInputClassName('username')}`}
                                        />
                                        <Hash className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {touchedFields.username && formErrors.username && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email & Password */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter email"
                                            value={inputs.email}
                                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                                            onBlur={() => setTouchedFields(prev => ({ ...prev, email: true }))}
                                            className={`pl-10 ${getInputClassName('email')}`}
                                        />
                                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {touchedFields.email && formErrors.email && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-blue-600" />
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="password"
                                            id="password"
                                            placeholder="Enter password"
                                            value={inputs.password}
                                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                            onBlur={() => setTouchedFields(prev => ({ ...prev, password: true }))}
                                            className={`pl-10 ${getInputClassName('password')}`}
                                        />
                                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {touchedFields.password && formErrors.password && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                                    )}
                                </div>
                            </div>

                            {/* Gender & Birthday */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                        <div className="space-y-4">
                            <FavoriteTopics
                                selectedTopics={inputs.favoriteTopics}
                                toggleTopic={toggleTopic}
                                className='h-[280px] sm:h-[280px]'
                                otherClassName='h-[290px] sm:h-[290px]'
                            />
                        </div>

                        {/* Submit button */}
                        <div className="md:col-span-2">
                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className='loading loading-spinner'></span>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Google button và sign in link */}
                    <div className="space-y-3">
                        <a
                            href={googleUrl}
                            className="w-full h-11 text-base font-medium flex items-center justify-center gap-2 hover:bg-gray-50 border-2 rounded-md"
                        >
                            <FcGoogle className="text-xl" />
                            <span>Continue with Google</span>
                        </a>

                        <p className="text-center text-sm text-gray-500 mt-4">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-600 hover:underline font-medium">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
