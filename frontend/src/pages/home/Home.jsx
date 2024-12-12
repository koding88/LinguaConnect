import { useState, useEffect, useCallback } from 'react'
import WhatNew from '@/components/WhatNew';
import ListPost from '@/components/posts/ListPost';
import PostDialogCustom from '@/components/dialog/PostDialogCustom';
import PostSkeleton from '@/components/skeleton/PostSkeleton';
import { useAuthContext } from '@/context/AuthContext'
import usePostZ from '@/zustand/usePostZ';
import FloatButton from '@/components/button/FloatButton';
import { ChevronDown } from 'lucide-react'
import DialogFilter from '@/components/dialog/DialogFilter'
import { Button } from '@/components/ui/button'

// Define filter options and corresponding titles
const filterOptions = {
    'for-you': {
        title: 'Your Feed',
        action: 'getAllPosts'
    },
    'following': {
        title: 'Following Feed',
        action: 'filterPostByFollowing'
    },
    'liked': {
        title: 'Liked Posts',
        action: 'filterPostByLikes'
    },
    'comments': {
        title: 'Commented Posts',
        action: 'filterPostByComments'
    }
};

const Home = () => {
    const { authUser } = useAuthContext()
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
    const { 
        getAllPosts, 
        filterPostByFollowing, 
        filterPostByLikes,
        filterPostByComments,
        loading, 
        posts,
        pagination 
    } = usePostZ();
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('for-you');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getAllPosts(1, 10, false);
    }, [getAllPosts]);

    const handleOpenPostDialog = () => setIsPostDialogOpen(true);
    const handleClosePostDialog = () => setIsPostDialogOpen(false);
    const handlePostCreated = () => {
        setCurrentPage(1);
        getAllPosts(1, 10, false);
    };

    const handleFilterChange = (filterId) => {
        setCurrentFilter(filterId);
        setCurrentPage(1);
        const filterAction = filterOptions[filterId].action;
        
        switch (filterAction) {
            case 'getAllPosts':
                getAllPosts(1, 10, false);
                break;
            case 'filterPostByFollowing':
                filterPostByFollowing();
                break;
            case 'filterPostByLikes':
                filterPostByLikes();
                break;
            case 'filterPostByComments':
                filterPostByComments();
                break;
            default:
                getAllPosts(1, 10, false);
        }
    };

    const handleScroll = useCallback(() => {
        if (loading || !pagination?.hasMore) return;

        const scrollPosition = window.innerHeight + window.pageYOffset;
        const scrollThreshold = document.documentElement.scrollHeight - 100;
        
        if (scrollPosition >= scrollThreshold) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            getAllPosts(nextPage, 10, true);
        }
    }, [loading, pagination?.hasMore, currentPage, getAllPosts]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div className="container max-w-5xl mx-auto px-4 py-8">
            {/* Filter Dialog */}
            <DialogFilter
                isOpen={isFilterDialogOpen}
                onClose={() => setIsFilterDialogOpen(false)}
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
            />

            {/* Create Post Dialog */}
            <PostDialogCustom
                isOpen={isPostDialogOpen}
                onClose={handleClosePostDialog}
                user={authUser}
                onPostCreated={handlePostCreated}
            />

            {/* Filter Bar */}
            <div className='flex items-center justify-center gap-2'>
                <h1 className='text-3xl font-bold text-center animate-fade-in flex items-center gap-2'>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        {filterOptions[currentFilter].title}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-200"
                        onClick={() => setIsFilterDialogOpen(true)}
                    >
                        <div className="p-1 rounded-full border border-blue-600/30 transition-all duration-200 group-hover:border-blue-600/50 hover:border-blue-600/50 hover:shadow-inner">
                            <ChevronDown className="w-4 h-4 text-blue-600 transition-transform duration-200 hover:scale-180" />
                        </div>
                    </Button>
                </h1>
            </div>

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
                    ) : posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center h-[calc(100vh-200px)] animate-fade-in">
                            <div className="w-24 h-24 mb-4 text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Found</h3>
                            <p className="text-gray-500 mb-4">There are no posts to display at the moment.</p>
                        </div>
                    ) : (
                        <div className="p-4">
                            <div className="space-y-4">
                                <ListPost posts={posts} />
                                {loading && (
                                    <div className="space-y-4">
                                        <PostSkeleton />
                                        <PostSkeleton />
                                    </div>
                                )}
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
        </div>
    )
}

export default Home
