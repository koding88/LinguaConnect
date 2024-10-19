import { IoMdHeart } from 'react-icons/io';
import { CiHeart } from 'react-icons/ci';
import { LuMessageCircle } from 'react-icons/lu';
import { getFlagImage } from '@/utils/flag';
import React from 'react'

const Reaction = ({ post, isLiked, handleLike, handleOpenCommentDialog }) => {
    const HeartIcon = isLiked ? IoMdHeart : CiHeart;
    const heartClass = `h-6 w-6 mr-2 cursor-pointer ${isLiked ? 'text-red-500' : ''}`;

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center">
                <HeartIcon className={heartClass} onClick={handleLike} />
                <span>{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center cursor-pointer" onClick={handleOpenCommentDialog}>
                <LuMessageCircle className="w-6 h-6 mr-2" />
                <span>{post.comments?.length || 0}</span>
            </div>
            <div className="flex items-center">
                <img
                    src={getFlagImage(post.user?.location)}
                    alt={post.user?.location || 'User location'}
                    className="w-8 h-6 mr-2 rounded-sm"
                />
            </div>
        </div>
    );
};

export default Reaction;
