import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from "@/components/ui/switch"
import useUserZ from '@/zustand/useUserZ'
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify'
import { useAuthContext } from '@/context/AuthContext'

const TwoFactor2FA = () => {
    const { authUser } = useAuthContext();
    const [is2FAEnabled, setIs2FAEnabled] = useState(authUser?.isEnable2FA);
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
        <div className='p-8'>
            <h2 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Two Factor Authentication
            </h2>
            <p className="text-sm text-gray-600 mb-6">
                Add an extra layer of security to your account
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-medium mb-1">2FA Status</h3>
                        <p className="text-sm text-gray-600">
                            {is2FAEnabled ? 'Currently enabled' : 'Currently disabled'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="2fa-mode"
                            checked={is2FAEnabled}
                            onCheckedChange={handle2FAToggle}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600"
                        />
                        <Label htmlFor="2fa-mode">
                            {is2FAEnabled ? 'Enabled' : 'Disabled'}
                        </Label>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-medium mb-4">QR Code Scanner</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Use Google Authenticator to scan this QR code
                </p>
                <div className="flex justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                    {is2FAEnabled && otpUrl ? (
                        <QRCodeSVG value={otpUrl} size={160} />
                    ) : (
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MrBeanDev"
                            alt="QR Code for 2FA"
                            className="w-40 h-40 opacity-70 blur-sm"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default TwoFactor2FA
