import React from 'react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const ChangePassword = ({ onSubmit }) => {
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [showOldPassword, setShowOldPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const validatePassword = (password, type) => {
        if (!password.trim()) return `${type} password is required.`;
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password)) {
            return `${type} password must be at least 8 characters long and include letters and numbers.`;
        }
        return "";
    };

    const validateConfirmPassword = (password) => {
        if (!password.trim()) return "Confirm password is required.";
        if (newPassword !== password) return "Passwords do not match.";
        return "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const oldPasswordError = validatePassword(oldPassword, "Old");
        const newPasswordError = validatePassword(newPassword, "New");
        const confirmPasswordError = validateConfirmPassword(confirmPassword);

        if (oldPasswordError || newPasswordError || confirmPasswordError) {
            setError(oldPasswordError || newPasswordError || confirmPasswordError);
            return;
        }

        setError('');
        onSubmit(oldPassword, newPassword);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className='p-8'>
            <div className='p-4 rounded-md border border-[#d5d5d5]'>
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label className="block text-sm font-medium text-black mb-1">Old Password</Label>
                        <div className="relative">
                            <Input
                                type={showOldPassword ? "text" : "password"}
                                className="w-full h-11 border border-[#d5d5d5] rounded-md p-2 pr-10"
                                placeholder="Enter your old password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                            >
                                {showOldPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <Label className="block text-sm font-medium text-black mb-1">New Password</Label>
                        <div className="relative">
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                className="w-full h-11 border border-[#d5d5d5] rounded-md p-2 pr-10"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <Label className="block text-sm font-medium text-black mb-1">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full h-11 border border-[#d5d5d5] rounded-md p-2 pr-10"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-1 mb-2">{error}</p>}
                    <Button
                        type="submit"
                        className="w-full h-11 bg-black text-white rounded-md"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
