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
    ArrowLeft,
    ThumbsUp,
} from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import usePostZ from "@/zustand/usePostZ"
import { extractTime } from '@/utils/extractTime'
import ListImage from '@/components/posts/ListImage';

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

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase() || '??';
    };

    return (
        <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50">
            <div className="flex flex-col items-center p-6 md:pt-10">
                <div className="flex items-center gap-3 mb-8">
                    <ImageIcon className="w-7 h-7 text-blue-600" />
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Post Detail
                    </h1>
                </div>

                <div className="w-full max-w-4xl space-y-6">
                    <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                        <div className="space-y-8">
                            {/* Owner */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-500" />
                                    <label className="text-sm font-semibold text-gray-700">Owner</label>
                                </div>
                                <input
                                    type="text"
                                    value={post.user?.username || ''}
                                    className="w-full p-3 border rounded-lg bg-gray-50/50 focus:ring-2 focus:ring-blue-500/20"
                                    disabled
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    <label className="text-sm font-semibold text-gray-700">Content</label>
                                </div>
                                <textarea
                                    value={post.content || ''}
                                    className="w-full p-3 border rounded-lg bg-gray-50/50 min-h-[150px] resize-none focus:ring-2 focus:ring-blue-500/20"
                                    disabled
                                />
                            </div>

                            {/* Images */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Images className="w-5 h-5 text-blue-500" />
                                    <label className="text-sm font-semibold text-gray-700">Images</label>
                                </div>
                                {post.images?.length > 0 && (
                                    <div className="relative rounded-xl overflow-hidden border border-gray-100">
                                        <ScrollArea className="w-full whitespace-nowrap">
                                            <div className="flex w-full gap-4 p-2">
                                                <ListImage
                                                    images={post.images}
                                                />
                                            </div>
                                            {post.images.length > 2 && <ScrollBar orientation="horizontal" />}
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="likes">
                                <AccordionTrigger className="px-8 py-4 hover:no-underline">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-rose-500" />
                                        <span className="font-semibold">
                                            Likes ({post.likes?.length || 0})
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ScrollArea className="h-[300px] px-8 py-4">
                                        <div className="space-y-4">
                                            {post.likes?.map((like, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={like.avatarUrl} />
                                                        <AvatarFallback>
                                                            {getInitials(like.username)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {like.username}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {like.full_name}
                                                        </p>
                                                    </div>
                                                    <ThumbsUp className="w-4 h-4 text-blue-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="comments">
                                <AccordionTrigger className="px-8 py-4 hover:no-underline">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-blue-500" />
                                        <span className="font-semibold">
                                            Comments ({post.comments?.length || 0})
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ScrollArea className="h-[400px] px-8 py-4">
                                        <div className="space-y-6">
                                            {post.comments?.map((comment, index) => (
                                                <div
                                                    key={index}
                                                    className="space-y-4"
                                                >
                                                    <div className="flex gap-4">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={comment.user?.avatarUrl} />
                                                            <AvatarFallback>
                                                                {getInitials(comment.user?.username)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="bg-gray-50 rounded-2xl p-4">
                                                                <p className="font-medium text-gray-900">
                                                                    {comment.user?.username}
                                                                </p>
                                                                <p className="text-gray-700 mt-1">
                                                                    {comment.content}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                <span>{extractTime(comment.createdAt)}</span>
                                                                <div className="flex items-center gap-1">
                                                                    <Heart className="w-4 h-4 text-rose-500" />
                                                                    <span>{comment.likes?.length || 0} likes</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {comment.likes?.length > 0 && (
                                                        <div className="ml-14 bg-gray-50/50 rounded-xl p-4">
                                                            <p className="text-sm font-medium text-gray-700 mb-3">
                                                                Liked by:
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {comment.likes.map((like, likeIndex) => (
                                                                    <div
                                                                        key={likeIndex}
                                                                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100"
                                                                    >
                                                                        <Avatar className="h-6 w-6">
                                                                            <AvatarImage src={like.avatarUrl} />
                                                                            <AvatarFallback className="text-xs">
                                                                                {getInitials(like.username)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <span className="text-sm font-medium">
                                                                            {like.username}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={() => navigate(-1)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200 gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetailManage
