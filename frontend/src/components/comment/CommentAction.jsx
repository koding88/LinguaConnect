import React from 'react'
import { Button } from '../ui/button'
import { IoMdHeart } from 'react-icons/io'
import { CiHeart } from 'react-icons/ci'
import DropdownComment from '../dropdown/DropdownComment'

const CommentActions = ({ comment, authUser, handleLikeComment, onDelete, postId, onEdit }) => {
    return (
        <div className="flex space-x-2">
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-full transition-colors duration-200"
                onClick={() => handleLikeComment(comment?._id)}
            >
                {comment?.likes?.includes(authUser?._id) ? (
                    <IoMdHeart className='h-6 w-6 text-red-500' />
                ) : (
                    <CiHeart className='h-6 w-6' />
                )}
            </Button>

            <DropdownComment
                comment={comment}
                authUser={authUser}
                onDelete={onDelete}
                onEdit={onEdit}
                postId={postId}
            />
        </div>
    );
};

export default CommentActions
