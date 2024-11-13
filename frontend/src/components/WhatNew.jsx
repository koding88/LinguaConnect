import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const WhatNew = ({ avatarUrl, handleOpenDialog }) => {
    return (
        <div className='p-4 flex items-center justify-between gap-4'>
            <div className='flex items-center flex-1 gap-4'>
                <Avatar className="w-10 h-10 ring-2 ring-purple-100">
                    <AvatarImage
                        src={avatarUrl || "https://avatar.iran.liara.run/public"}
                        alt="User avatar"
                        className="object-cover"
                    />
                    <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
                <input
                    type="text"
                    placeholder="What's new?"
                    className='w-full h-12 px-4 text-gray-600 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200'
                    onClick={handleOpenDialog}
                    readOnly
                />
            </div>
            <Button
                onClick={handleOpenDialog}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
            >
                Post
            </Button>
        </div>
    )
}

export default WhatNew
