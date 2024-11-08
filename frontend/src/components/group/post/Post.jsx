import React, { useState, useContext, useEffect } from 'react'
import AvatarCustom from '@/components/avatar/AvatarCustom'
import Reaction from '../../reaction/reaction'
import useGroupZ from '@/zustand/useGroupZ'
import { AuthContext } from '@/context/AuthContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom';
import ListImage from '../../posts/ListImage'
import Name from '../../avatar/Name'
import DropdownCustom from '../../dropdown/dropdownCustom'

const Post = ({ post }) => {
    const { likeGroupPost, editGroupPost, deleteGroupPost, reportPostGroup } = useGroupZ();
    const { authUser } = useContext(AuthContext);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [currentPost, setCurrentPost] = useState(post);

    useEffect(() => {
        setCurrentPost(post);
    }, [post]);

    const isLiked = currentPost?.likes?.some(like => like._id === authUser?._id);
    const handleBookmark = () => setIsBookmarked(!isBookmarked);

    const handleEdit = async (postId, ...args) => {
        await editGroupPost(currentPost?.group, postId, ...args);
    }

    const handleLike = async () => {
        if (authUser?._id) {
            const updatedLikes = await likeGroupPost(currentPost?.group, currentPost?._id);
            if (updatedLikes) {
                setCurrentPost(prev => ({ ...prev, likes: updatedLikes }));
            }
        } else {
            toast.error("You need to be logged in to like a post");
        }
    };

    const handleDelete = async (postId) => {
        await deleteGroupPost(currentPost?.group, postId);
    };

    const handleReport = async (postId) => {
        await reportPostGroup(currentPost?.group, postId);
    };

    if (!currentPost) return null;

    return (
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-start mb-4">
                <div className="relative mr-4">
                    <AvatarCustom {...currentPost} />
                </div>
                <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                            <Name {...currentPost} />
                        </div>

                        <DropdownCustom
                            owner={currentPost?.user?._id}
                            post={currentPost}
                            canEdit={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onReport={handleReport}
                        />
                    </div>
                    <Link to={`/groups/${currentPost?.group}/posts/${currentPost?._id}`}>
                        <p className="text-sm mb-4">{currentPost?.content}</p>
                    </Link>

                    <ListImage {...currentPost} />

                    <Reaction post={currentPost} isLiked={isLiked} isBookmarked={isBookmarked} handleLike={handleLike} handleBookmark={handleBookmark} />
                </div>
            </div>
        </div>
    )
}

export default Post
