import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IoSend } from "react-icons/io5";

const Reply = ({ handleOpenCommentDialog }) => {
    return (
        <div className="relative">
            <Input
                type="text"
                placeholder="Write a comment..."
                className="w-full h-12 pl-4 pr-[100px] text-gray-600 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                onClick={handleOpenCommentDialog}
                readOnly
            />
            <Button
                onClick={handleOpenCommentDialog}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md transition-all duration-200 rounded-lg h-8 px-4"
            >
                <div className="flex items-center gap-2">
                    <IoSend className="w-4 h-4" />
                    <span className="text-sm">Comment</span>
                </div>
            </Button>
        </div>
    )
}

export default Reply
