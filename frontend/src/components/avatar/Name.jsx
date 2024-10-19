import React from 'react'
import { Link } from 'react-router-dom'
import { extractTime } from '@/utils/extractTime';

const Name = ({ ...props }) => {
    return <>
        <Link to={`/profile/${props?.user?._id}`}>
            <span className="font-semibold mr-2 hover:underline">{props?.user?.username}</span>
        </Link>
        {props?.createdAt && <span className="text-[#999999]">{extractTime(props?.createdAt) || ''}</span>}
    </>
}

export default Name
