import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Reply = ({ handleOpenCommentDialog }) => {
    return <>
        <Input
            type="text"
            placeholder="Post reply"
            className="w-full h-12 px-6 py-4 border border-[#D5D5D5] rounded-[10px] text-sm text-[#999999] font-roboto"
            onClick={handleOpenCommentDialog}
        />
        <Button
            onClick={handleOpenCommentDialog}
            className="absolute right-2 top-2 w-20 h-8 bg-black text-white rounded-md text-sm font-roboto"
        >
            Comment
        </Button>
    </>
}

export default Reply
