import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
    Image as ImageIcon,
    User,
    FileText,
    Images,
    Heart,
    MessageSquare,
    Users,
    Calendar,
    ArrowLeft
} from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import usePostZ from "@/zustand/usePostZ"

const PostDetailManage = () => {
    const { getPostByIdManage } = usePostZ();
    const [post, setPost] = useState({});
    const navigate = useNavigate()
    const { postId } = useParams()

    useEffect(() => {
        getPostByIdManage(postId)
            .then(data => {
                setPost(data)
            })
    }, [postId, getPostByIdManage])

    console.log(post)

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="flex flex-col items-center p-6 md:pt-10">
                <div className="flex items-center gap-2 mb-6">
                    <ImageIcon className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Post Detail</h1>
                </div>

                <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-sm">
                    <div className="space-y-6">
                        {/* Owner */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <label className="text-sm font-medium">Owner</label>
                            </div>
                            <input
                                type="text"
                                value={post.user?.username || ''}
                                className="w-full p-2 border rounded-md bg-gray-50"
                                disabled
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <label className="text-sm font-medium">Content</label>
                            </div>
                            <textarea
                                value={post.content || ''}
                                className="w-full p-2 border rounded-md bg-gray-50 min-h-[150px] resize-none"
                                disabled
                            />
                        </div>

                        {/* Images */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Images className="w-4 h-4 text-gray-500" />
                                <label className="text-sm font-medium">Image</label>
                            </div>
                            {post.images?.length > 0 && (
                                <div className="relative">
                                    <ScrollArea className="w-full whitespace-nowrap rounded-md">
                                        <div className="flex w-full gap-4 p-1">
                                            {post.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`Post image ${index + 1}`}
                                                    className="rounded-md object-cover"
                                                    style={{
                                                        width: post.images.length === 1 ? '100%' :
                                                            post.images.length === 2 ? 'calc(50% - 8px)' : '300px',
                                                        height: '200px'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        {post.images.length > 2 && <ScrollBar orientation="horizontal" />}
                                    </ScrollArea>
                                </div>
                            )}
                        </div>

                        {/* Stats and Info */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Like and Comment */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Like</label>
                                </div>
                                <input
                                    type="number"
                                    value={post.likes?.length || 0}
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Comment</label>
                                </div>
                                <input
                                    type="number"
                                    value={post.comments?.length || 0}
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                    disabled
                                />
                            </div>

                            {/* Group and Create At */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Group</label>
                                </div>
                                <input
                                    type="text"
                                    value={post.group?.name || 'No Group'}
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Create At</label>
                                </div>
                                <input
                                    type="text"
                                    value={post.createdAt ? new Date(post.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    }) : ''}
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={() => navigate(-1)}
                                className="bg-black text-white"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetailManage
