import React, { useState, useEffect } from 'react'
import WhatNew from '@/components/whatnew';
import ListPost from '@/components/posts/ListPost';
import PostDialogCustom from '@/components/dialog/PostDialogCustom';
import PostSkeleton from '@/components/skeleton/PostSkeleton';
import { useAuthContext } from '@/context/AuthContext'
import usePostZ from '@/zustand/usePostZ';
import FloatButton from '@/components/button/FloatButton';

const Home = () => {
    const { authUser } = useAuthContext()
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
    const { getAllPosts, loading, posts } = usePostZ();

    useEffect(() => {
        getAllPosts(true);
        const interval = setInterval(getAllPosts, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleOpenPostDialog = () => setIsPostDialogOpen(true);
    const handleClosePostDialog = () => setIsPostDialogOpen(false);
    const handlePostCreated = getAllPosts;

    return (
        <div className="space-y-6">
            {/* Header */}
            <h1 className='text-3xl font-bold text-center animate-fade-in'>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Your Feed
                </span>
            </h1>

            {/* Main Content */}
            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
                {/* What's new section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <WhatNew
                        avatarUrl={authUser?.avatarUrl}
                        handleOpenDialog={handleOpenPostDialog}
                    />
                </div>

                {/* Posts section */}
                <div className="divide-y divide-gray-100">
                    {loading && posts.length === 0 ? (
                        <div className="space-y-4 p-4">
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </div>
                    ) : (
                        <div className="p-4 custom-scrollbar">
                            <div className="space-y-4">
                                <ListPost posts={posts} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-20 md:bottom-6 right-6">
                <FloatButton
                    onClick={handleOpenPostDialog}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                />
            </div>

            {/* Create Post Modal */}
            <PostDialogCustom
                isOpen={isPostDialogOpen}
                onClose={handleClosePostDialog}
                user={authUser}
                onPostCreated={handlePostCreated}
            />
        </div>
    )
}

export default Home
