import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/Label'
import { Switch } from "@/components/ui/switch"
import useUserZ from '@/zustand/useUserZ'
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify'

const TwoFactor2FA = () => {
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [otpUrl, setOtpUrl] = useState('');
    const { enable2FA, disable2FA } = useUserZ();

    const handle2FAToggle = async () => {
        try {
            if (!is2FAEnabled) {
                const data = await enable2FA();
                setOtpUrl(data.otp_url);
                setIs2FAEnabled(true);
            } else {
                await disable2FA();
                setOtpUrl('');
                setIs2FAEnabled(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error enabling 2FA');
        }
    };

    return (
        <div className='p-4 rounded-md border border-[#d5d5d5]'>
            <h2 className="text-lg font-semibold mb-4">Two Factor Authentication</h2>
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">2FA</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Use Google authentication to scan the QR Code</p>
            <div className="flex items-center space-x-2 mb-4">
                <Switch id="2fa-mode" checked={is2FAEnabled} onCheckedChange={handle2FAToggle} />
                <Label htmlFor="2fa-mode">Enable 2FA</Label>
            </div>
            <div className="flex justify-start">
                {is2FAEnabled && otpUrl ? (
                    <QRCodeSVG value={otpUrl} size={128} />
                ) : (
                    <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MrBeanDev"
                        alt="QR Code for 2FA"
                        className="w-32 h-32 opacity-70 blur-sm"
                    />
                )}
            </div>
        </div>
    )
}

export default TwoFactor2FA
