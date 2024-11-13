import React from 'react'
import Header from '@/components/header/Header'
import ChangePassword from './ChangePassword'
import useUserZ from '@/zustand/useUserZ'
import TwoFactor2FA from './TwoFactor2FA'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiLockPasswordLine } from "react-icons/ri"
import { MdSecurity } from "react-icons/md"

const Setting = () => {
    const { changePassword } = useUserZ();
    const handleChangePassword = (oldPassword, newPassword) => {
        changePassword({ oldPassword, newPassword });
    }

    return (
        <div className="space-y-6">
            <Header props={{ path: -1, title: 'Settings', className: 'pb-0' }} />

            {/* Main Content */}
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
    )
}

export default Setting
