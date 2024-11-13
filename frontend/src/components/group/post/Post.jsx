import React, { useState, useContext, useEffect } from 'react'
import AvatarCustom from '@/components/avatar/AvatarCustom'
import Reaction from '../../reaction/reaction'
import useGroupZ from '@/zustand/useGroupZ'
import { AuthContext } from '@/context/AuthContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import ListImage from '../../posts/ListImage'
import Name from '../../avatar/Name'
import DropdownCustom from '../../dropdown/dropdownCustom'

const Post = ({ post }) => {
    const { likeGroupPost, editGroupPost, deleteGroupPost, reportPostGroup } = useGroupZ()
    const { authUser } = useContext(AuthContext)
    const [currentPost, setCurrentPost] = useState(post)
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)

    useEffect(() => {
        setCurrentPost(post)
    }, [post])

    const isLiked = currentPost?.likes?.some(like => like._id === authUser?._id)

    const handleEdit = async (postId, ...args) => {
        await editGroupPost(currentPost?.group, postId, ...args)
    }

    const handleLike = async () => {
        if (authUser?._id) {
            const updatedLikes = await likeGroupPost(currentPost?.group, currentPost?._id)
            if (updatedLikes) {
                setCurrentPost(prev => ({ ...prev, likes: updatedLikes }))
            }
        } else {
            toast.error("You need to be logged in to like a post")
        }
    }

    const handleDelete = async (postId) => {
        await deleteGroupPost(currentPost?.group, postId)
    }

    const handleReport = async (postId) => {
        await reportPostGroup(currentPost?.group, postId)
    }

    const handleOpenCommentDialog = () => {
        setIsCommentDialogOpen(true)
    }

    if (!currentPost) return null

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${currentPost?.user?._id}`} className="block">
                        <div className="relative">
                            <AvatarCustom {...currentPost} className="ring-2 ring-purple-100" />
                        </div>
                    </Link>
                    <div>
                        <Name {...currentPost} className="font-medium text-gray-900 hover:text-blue-600 transition-colors" />
                    </div>
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

            {/* Content */}
            <Link to={`/groups/${currentPost?.group}/posts/${currentPost?._id}`}>
                <div className="space-y-4">
                    {currentPost?.content && (
                        <p className="text-gray-700 leading-relaxed">
                            {currentPost.content}
                        </p>
                    )}

                    {/* Images */}
                    <div className="rounded-xl overflow-hidden">
                        <ListImage {...currentPost} />
                    </div>
                </div>
            </Link>

            {/* Divider */}
            <div className="my-4 border-t border-gray-100" />

            {/* Reactions */}
            <div className="flex items-center justify-between">
                <Reaction
                    post={currentPost}
                    group={true}
                    isLiked={isLiked}
                    handleOpenCommentDialog={handleOpenCommentDialog}
                    handleLike={handleLike}
                    className="hover:bg-blue-50 transition-colors"
                />
            </div>
        </div>
    )
}

export default Post
