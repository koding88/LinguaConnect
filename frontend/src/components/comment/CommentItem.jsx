import React from 'react'
import AvatarCustom from '@/components/avatar/AvatarCustom'
import {extractTime} from '@/utils/extractTime'
import CommentActions from './CommentAction'
import { getFlagImage } from '@/utils/flag'

const CommentItem = ({ ...props }) => {
    return (
        <div className="flex items-start space-x-3 border border-gray-200 p-3 rounded-lg">
            <AvatarCustom {...props?.comment} />
            <div className="flex-grow">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-semibold mr-2">{props?.comment?.user?.username || props?.authUser?.username}</span>
                        <span className="text-[#999999] text-sm">{extractTime(props?.comment?.createdAt)}</span>
                    </div>
                    <CommentActions {...props} />
                </div>
                <p className="text-sm mt-1">{props?.comment?.content}</p>
                <div className="flex items-center mt-2 text-sm">
                    <span>{props?.comment?.likes?.length} like{props?.comment?.likes?.length !== 1 ? 's' : ''}</span>
                    <img src={getFlagImage(props?.comment?.user?.location)} alt={props?.comment?.user?.location} className="w-8 h-6 ml-4 rounded-sm" />
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
