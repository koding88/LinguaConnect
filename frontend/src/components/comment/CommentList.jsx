import React, { useState } from 'react';
import CommentItem from './CommentItem';
import { TbMessage2X } from "react-icons/tb";

const CommentList = ({ comments, postId, authUser, handleLikeComment, onEdit, onDelete }) => {
    const [visibleComments, setVisibleComments] = useState(3);

    const handleShowMore = () => {
        setVisibleComments(prev => prev + 3);
    };

    if (!comments?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <TbMessage2X className="w-12 h-12 mb-2" />
                <p className="text-sm">No comments yet. Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div>
            {comments.slice(0, visibleComments).map(comment => (
                <CommentItem
                    key={comment?._id}
                    comment={comment}
                    postId={postId}
                    authUser={authUser}
                    handleLikeComment={handleLikeComment}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
            {visibleComments < comments.length && (
                <div className="text-center mt-4">
                    <button
                        onClick={handleShowMore}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                        Show more
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentList;
