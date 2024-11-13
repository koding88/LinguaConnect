import React from 'react'
import ChangePassword from '../settings/ChangePassword'
import TwoFactor2FA from '../settings/TwoFactor2FA'
import useUserZ from '@/zustand/useUserZ'
import { Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiLockPasswordLine } from "react-icons/ri"
import { MdSecurity } from "react-icons/md"

const AdminSettings = () => {
    const { changePassword } = useUserZ();

    const handleChangePassword = (oldPassword, newPassword) => {
        changePassword({ oldPassword, newPassword });
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="flex flex-col items-center p-6 md:pt-10">
                <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-6 h-6 text-indigo-600" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                        Security Settings
                    </h1>
                </div>

                <div className="w-full max-w-3xl">
                    <div className='bg-white rounded-2xl shadow-xl border border-gray-100'>
                        <Tabs defaultValue="password" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                                <TabsTrigger
                                    value="password"
                                    className="bg-gradient-to-r from-white/50 to-white/50 hover:from-white/80 hover:to-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200 p-4 h-full"
                                >
                                    <div className="flex items-center space-x-2 px-2">
                                        <RiLockPasswordLine className="w-5 h-5" />
                                        <span>Password</span>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="2fa"
                                    className="bg-gradient-to-r from-white/50 to-white/50 hover:from-white/80 hover:to-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200 p-4 h-full"
                                >
                                    <div className="flex items-center space-x-2 px-2">
                                        <MdSecurity className="w-5 h-5" />
                                        <span>2FA</span>
                                    </div>
                                </TabsTrigger>
                            </TabsList>

                            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-6 rounded-2xl">
                                <TabsContent value="password">
                                    <div className='rounded-xl border border-gray-100 shadow-sm bg-white overflow-hidden'>
                                        <ChangePassword onSubmit={handleChangePassword} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="2fa">
                                    <div className='rounded-xl border border-gray-100 shadow-sm bg-white overflow-hidden'>
                                        <TwoFactor2FA />
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSettings
