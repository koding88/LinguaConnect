import React from 'react'
import CommentItem from './CommentItem'

const CommentList = ({ ...props }) => {
    return props?.comments?.length > 0 ? (
        props?.comments?.map(comment => (
            <CommentItem
                key={comment?._id}
                comment={comment}
                postId={props?.postId}
                authUser={props?.authUser}
                handleLikeComment={props?.handleLikeComment}
                onEdit={props?.onEdit}
                onDelete={props?.onDelete}
            />
        ))
    ) : (
        <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
    );
};


export default CommentList
