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
        <>
            <h1 className='text-center text-black text-lg font-medium font-roboto py-6 flex items-center justify-center'>For you</h1>
            <div className='flex-grow flex flex-col'>
                <div className='bg-white rounded-tl-[28px] rounded-tr-[28px] flex-1 border-[1px] border-[#D5D5D5] flex flex-col'>
                    {/* What's new */}
                    <WhatNew avatarUrl={`${authUser?.avatarUrl}` || "https://avatar.iran.liara.run/public"} handleOpenDialog={handleOpenPostDialog} />
                    {/* List posts */}
                    <div className="flex-grow overflow-y-auto">
                        {loading && posts.length === 0 ? (
                            // Display 3 skeleton posts only when loading and no posts are available
                            <>
                                <PostSkeleton />
                                <PostSkeleton />
                                <PostSkeleton />
                            </>
                        ) : (
                            <ListPost posts={posts} />
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button for Create Post */}
            <FloatButton onClick={handleOpenPostDialog} />

            {/* Create Post Modal */}
            <PostDialogCustom
                isOpen={isPostDialogOpen}
                onClose={handleClosePostDialog}
                user={authUser}
                onPostCreated={handlePostCreated}
            />
        </>
    )
}

export default Home
