import React from 'react'
import { Button } from "@/components/ui/button"
import ChangePassword from '../settings/ChangePassword'
import TwoFactor2FA from '../settings/TwoFactor2FA'
import useUserZ from '@/zustand/useUserZ'
import { Shield } from "lucide-react"

const AdminSettings = () => {
    const { changePassword } = useUserZ();

    const handleChangePassword = (oldPassword, newPassword) => {
        changePassword({ oldPassword, newPassword });
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="flex flex-col items-center p-6 md:pt-10">
                <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Security Settings</h1>
                </div>

                <div className="w-full max-w-3xl space-y-6">
                    {/* Change Password Section */}
                    <div className="p-6 bg-white rounded-lg shadow-lg ring-1 ring-black/5">
                        <ChangePassword
                            onSubmit={handleChangePassword}
                        />
                    </div>

                    {/* Two Factor Authentication Section */}
                    <div className="p-6 bg-white rounded-lg shadow-lg ring-1 ring-black/5">
                        <TwoFactor2FA />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSettings
