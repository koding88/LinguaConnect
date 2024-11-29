import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import usePostZ from '@/zustand/usePostZ';
import { toast } from 'react-toastify';
import PostDialogCustom from '@/components/dialog/PostDialogCustom';
import AvatarCustom from '@/components/avatar/AvatarCustom';
import CommentDialog from '@/components/dialog/CommentDialog';
import Error from '@/components/Error';
import FloatButton from '@/components/button/FloatButton';
import Reaction from '@/components/reaction/Reaction';
import Reply from '@/components/comment/Reply';
import Name from '@/components/avatar/Name';
import ListImage from '@/components/posts/ListImage';
import CommentList from '@/components/comment/CommentList';
import { Skeleton } from '@/components/ui/skeleton';
import DropdownCustom from '@/components/dropdown/DropdownCustom';
import { IoChevronBackOutline } from "react-icons/io5";

const PostDetail = () => {
    const { authUser } = useContext(AuthContext);
    const { postId } = useParams();
    const navigate = useNavigate();
    const { getPostById, likePost, likeComment, addComment, deletePost, editPost, editComment, deleteComment, reportPost } = usePostZ();
    const [currentPost, setCurrentPost] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const isLiked = currentPost?.likes?.includes(authUser?._id);
    const isBookmarked = false;

    useEffect(() => {
        const fetchPost = async () => {
            if (isInitialLoad) {
                setLoading(true);
            }
            const post = await getPostById(postId);
            if (post) {
                setCurrentPost(post);
                setError(false);
            } else {
                setError(true);
            }
            setLoading(false);
            setIsInitialLoad(false);
        };
        fetchPost();
    }, [postId, getPostById, isInitialLoad]);

    if (isInitialLoad && loading) {
        return null; // or a minimal loading indicator
    }

    const handleLike = async () => {
        if (!authUser) return toast.error("Login required to like a post");
        const updatedLikes = await likePost(postId, authUser._id);
        if (updatedLikes) setCurrentPost(prev => ({ ...prev, likes: updatedLikes }));
    };

    const handleLikeComment = async (commentId) => {
        if (!authUser) return toast.error("Login required to like a comment");
        const updatedComments = await likeComment(postId, commentId, authUser._id);
        if (updatedComments) setCurrentPost(prev => ({ ...prev, comments: updatedComments }));
    };

    const handleReplySubmit = async (content) => {
        const updatedComments = await addComment(postId, content);
        if (updatedComments) {
            setCurrentPost(prev => ({ ...prev, comments: updatedComments }));
            setIsCommentDialogOpen(false);
        }
    };

    const handleEditComment = async (postId, commentId, content) => {
        const updatedComments = await editComment(postId, commentId, content);
        if (updatedComments) {
            setCurrentPost(prev => ({ ...prev, comments: updatedComments }));
        }
    };

    const handleEditPost = async (postId, ...args) => {
        const updatedPost = await editPost(postId, ...args);
        if (updatedPost) {
            setCurrentPost(updatedPost);
        }
    };

    const handleDeletePost = async (postId) => {
        await deletePost(postId);
        navigate('/');
    };

    const handleDeleteComment = async (postId, commentId) => {
        const updatedComments = await deleteComment(postId, commentId);
        if (updatedComments) {
            setCurrentPost(prev => ({ ...prev, comments: updatedComments }));
        }
    };

    const handleReport = async (postId) => {
        await reportPost(postId);
    };

    const handleOpenPostDialog = () => setIsPostDialogOpen(true);
    const handleClosePostDialog = () => setIsPostDialogOpen(false);
    const handleOpenCommentDialog = () => setIsCommentDialogOpen(true);
    const handleCloseCommentDialog = () => setIsCommentDialogOpen(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    to="/"
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                    <IoChevronBackOutline className="w-6 h-6 text-gray-600" />
                </Link>
                <h1 className='text-3xl font-bold animate-fade-in'>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Post Detail
                    </span>
                </h1>
            </div>

            {/* Main Content */}
            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
                {!error ? (
                    <div className="divide-y divide-gray-100">
                        {/* Post Section */}
                        <div className="p-6">
                            {loading ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-12 h-12 rounded-full" />
                                        <div className="flex-1">
                                            <Skeleton className="h-4 w-1/4 mb-2" />
                                            <Skeleton className="h-3 w-1/6" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-64 w-full rounded-xl" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* User Info */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Link to={`/profile/${currentPost?.user?._id}`}>
                                                <AvatarCustom {...currentPost} className="ring-2 ring-purple-100" />
                                            </Link>
                                            <div>
                                                <Name {...currentPost} className="font-medium text-gray-900 hover:text-blue-600 transition-colors" />
                                            </div>
                                        </div>
                                        <DropdownCustom
                                            owner={currentPost?.user?._id}
                                            post={currentPost}
                                            canEdit={true}
                                            loading={loading}
                                            onEdit={handleEditPost}
                                            onDelete={handleDeletePost}
                                            onReport={handleReport}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <p className="text-gray-700 leading-relaxed">{currentPost?.content}</p>
                                        <div className="rounded-xl overflow-hidden">
                                            <ListImage {...currentPost} />
                                        </div>
                                    </div>

                                    {/* Reactions */}
                                    <div className="border-t border-gray-100 pt-4">
                                        <Reaction
                                            post={currentPost}
                                            isLiked={isLiked}
                                            isBookmarked={isBookmarked}
                                            handleLike={handleLike}
                                            handleOpenCommentDialog={handleOpenCommentDialog}
                                        />
                                    </div>

                                    {/* Reply Input */}
                                    <div className="relative">
                                        <Reply handleOpenCommentDialog={handleOpenCommentDialog} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Comments Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Comments</h3>
                                <div className="space-y-4">
                                    <CommentList
                                        comments={currentPost?.comments}
                                        authUser={authUser}
                                        handleLikeComment={handleLikeComment}
                                        onEdit={handleEditComment}
                                        onDelete={handleDeleteComment}
                                        postId={postId}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Error content='post' />
                )}
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6">
                <FloatButton
                    onClick={handleOpenPostDialog}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                />
            </div>

            {/* Dialogs */}
            <PostDialogCustom
                isOpen={isPostDialogOpen}
                onClose={handleClosePostDialog}
                user={authUser}
                redirectToHome={true}
            />

            <CommentDialog
                isOpen={isCommentDialogOpen}
                onClose={handleCloseCommentDialog}
                onOpenChange={setIsCommentDialogOpen}
                onSubmit={handleReplySubmit}
            />
        </div>
    );
}

export default PostDetail;
