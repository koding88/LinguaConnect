import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import usePostZ from '@/zustand/usePostZ';
import { toast } from 'react-toastify';
import PostDialogCustom from '@/components/dialog/PostDialogCustom';
import AvatarCustom from '@/components/avatar/AvatarCustom';
import CommentDialog from '@/components/dialog/CommentDialog';
import Error from '@/components/Error';
import FloatButton from '@/components/button/FloatButton';
import Reaction from '@/components/reaction/reaction';
import Reply from '@/components/comment/Reply';
import Name from '@/components/avatar/Name';
import ListImage from '@/components/posts/ListImage';
import CommentList from '@/components/comment/CommentList';
import { Skeleton } from '@/components/ui/skeleton';
import DropdownCustom from '@/components/dropdown/dropdownCustom';

import Header from '@/components/header/Header';

const PostDetail = () => {
    const { authUser } = useContext(AuthContext);
    const { postId } = useParams();
    const navigate = useNavigate();
    const { getPostById, likePost, likeComment, addComment, deletePost, editPost, editComment, deleteComment } = usePostZ();
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

    const handleOpenPostDialog = () => setIsPostDialogOpen(true);
    const handleClosePostDialog = () => setIsPostDialogOpen(false);
    const handleBookmark = () => { };
    const handleOpenCommentDialog = () => setIsCommentDialogOpen(true);

    return (
        <>
            <Header props={{ path: '/', title: 'Post Detail' }} />
            <div className='flex-grow flex flex-col'>
                <div className='bg-white rounded-tl-[28px] rounded-tr-[28px] flex-1 border-[1px] border-[#D5D5D5] flex flex-col'>
                    {/* Post */}
                    {!error ? (
                        <div className="flex-grow overflow-y-auto">
                            <div className="border-b border-[#D5D5D5] p-4">
                                {loading ? (
                                    <div className="flex items-start mb-4">
                                        <Skeleton className="w-12 h-12 rounded-full mr-4" />
                                        <div className="flex-grow">
                                            <Skeleton className="h-4 w-1/4 mb-2" />
                                            <Skeleton className="h-4 w-full mb-2" />
                                            <Skeleton className="h-4 w-3/4 mb-4" />
                                            {currentPost?.images && (
                                                <Skeleton className="h-80 w-full mb-4" />
                                            )}
                                            <Skeleton className="h-8 w-[150px] mb-4" />
                                            <Skeleton className="h-[48px] w-full" />
                                        </div>
                                    </div>
                                ) : (
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
                                                    loading={loading}
                                                    onEdit={handleEditPost}
                                                    onDelete={handleDeletePost}
                                                />
                                            </div>
                                            <p className="text-sm mb-4">{currentPost?.content}</p>

                                            {/* Image */}
                                            <ListImage {...currentPost} />

                                            {/* Like, Comment, Bookmark */}
                                            <Reaction
                                                post={currentPost}
                                                isLiked={isLiked}
                                                isBookmarked={isBookmarked}
                                                handleLike={handleLike}
                                                handleBookmark={handleBookmark}
                                                handleOpenCommentDialog={handleOpenCommentDialog}
                                            />

                                            {/* Reply interface */}
                                            <div className="mt-4 relative">
                                                <Reply handleOpenCommentDialog={handleOpenCommentDialog} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Comments section */}
                            <div className="mt-2 p-4">
                                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                                <div className="space-y-4 max-h-[600px]">
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
                    ) : (
                        <Error content='post' />
                    )}
                </div>
            </div>

            {/* Floating Action Button for Create Post */}
            <FloatButton onClick={handleOpenPostDialog} />

            {/* Create Post Modal */}
            <PostDialogCustom
                isOpen={isPostDialogOpen}
                onClose={handleClosePostDialog}
                user={authUser}
                redirectToHome={true}
            />

            {/* Comment Dialog */}
            <CommentDialog
                isOpen={isCommentDialogOpen}
                onOpenChange={setIsCommentDialogOpen}
                onSubmit={handleReplySubmit}
            />
        </>
    );
}

export default PostDetail;
