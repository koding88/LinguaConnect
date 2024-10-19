import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'

const AvatarCustom = ({ ...props }) => {
    return (
        <Link to={`/profile/${props?.user?._id}`}>
            <div className="relative">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={`${props?.user?.avatarUrl}` || "https://avatar.iran.liara.run/public"} alt="User avatar" />
                    <AvatarFallback>{props?.user?.username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
            </div>
        </Link>
    )
}

export default AvatarCustom
