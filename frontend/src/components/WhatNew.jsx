import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const WhatNew = ({ avatarUrl, handleOpenDialog }) => {
    return (
        <div className='p-4 border-b-[1px] border-[#D5D5D5] flex items-center justify-between'>
            <div className='flex items-center w-[535px]'>
                <Avatar className='w-10 h-10 mr-4'>
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={`${avatarUrl}` || "https://avatar.iran.liara.run/public"} alt="User avatar" />
                        <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                </Avatar>
                <input
                    type="text"
                    placeholder="What's new?"
                    className='text-[#999999] w-full h-10 text-sm font-roboto focus:outline-none'
                    onClick={handleOpenDialog}
                />
            </div>
            <Button onClick={handleOpenDialog}>Post</Button>
        </div>
    )
}

export default WhatNew
