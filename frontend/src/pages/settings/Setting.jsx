import React from 'react'
import Header from '@/components/header/Header'
import ChangePassword from './ChangePassword'
import useUserZ from '@/zustand/useUserZ'
import TwoFactor2FA from './TwoFactor2FA'

const Setting = () => {
    const { changePassword } = useUserZ();
    const handleChangePassword = (oldPassword, newPassword) => {
        changePassword({ oldPassword, newPassword });
    }

    return <>
        <div>
            <Header props={{ path: -1, title: 'Settings' }} />
            <div className='flex-grow flex flex-col h-screen'>
                <div className='bg-white rounded-tl-[28px] rounded-tr-[28px] flex-1 border-[1px] border-[#D5D5D5] flex flex-col overflow-hidden'>
                    <div className="flex-grow overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-[#D5D5D5] p-4 w-full z-10">
                            <div className="flex items-center">
                                <div className="text-black text-2xl ml-4 font-semibold">Security</div>
                            </div>
                        </div>

                        <div className='p-8'>
                            <div className='p-4 rounded-md border border-[#d5d5d5]'>
                                <ChangePassword onSubmit={handleChangePassword} />
                            </div>
                        </div>

                        <div className="pt-0 p-8">
                            <div className='p-4 rounded-md border border-[#d5d5d5]'>
                                <TwoFactor2FA />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Setting
