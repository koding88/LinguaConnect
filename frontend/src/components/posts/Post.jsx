import React, { useState, useContext, useEffect } from 'react'
import AvatarCustom from '@/components/avatar/AvatarCustom'
import Reaction from '../reaction/reaction'
import usePostZ from '@/zustand/usePostZ'
import { AuthContext } from '@/context/AuthContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom';
import ListImage from './ListImage'
import Name from '../avatar/Name'
import DropdownCustom from '../dropdown/dropdownCustom'

const Post = ({ post }) => {
    const { likePost, editPost, deletePost } = usePostZ();
    const { authUser } = useContext(AuthContext);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [currentPost, setCurrentPost] = useState(post);

    useEffect(() => {
        setCurrentPost(post);
    }, [post]);

    const isLiked = currentPost?.likes?.includes(authUser?._id);
    const handleBookmark = () => setIsBookmarked(!isBookmarked);

    const handleEdit = async (postId, ...args) => {
        await editPost(postId, ...args);
    }

    const handleLike = async () => {
        if (authUser?._id) {
            const updatedLikes = await likePost(currentPost._id, authUser._id);
            if (updatedLikes) {
                setCurrentPost(prev => ({ ...prev, likes: updatedLikes }));
            }
        } else {
            toast.error("You need to be logged in to like a post");
        }
    };

    const handleDelete = async (postId) => {
        await deletePost(postId);
    };


    if (!currentPost) return null;

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start mb-4">
                <div className="relative mr-4">
                    <AvatarCustom {...currentPost} />
                </div>
                <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                            <Name {...currentPost} />
                        </div>

                        {/* need check owner */}
                        <DropdownCustom
                            owner={currentPost?.user?._id}
                            post={currentPost}
                            canEdit={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                    </div>
                    <Link to={`/post/${currentPost?._id}`}>
                        <p className="text-sm mb-4">{currentPost?.content}</p>
                    </Link>

                    <ListImage {...currentPost} />

                    {/* Like, Comment, Bookmark */}
                    <Reaction post={currentPost} isLiked={isLiked} isBookmarked={isBookmarked} handleLike={handleLike} handleBookmark={handleBookmark} />
                </div>
            </div>
        </div>
    )
}

export default Post
