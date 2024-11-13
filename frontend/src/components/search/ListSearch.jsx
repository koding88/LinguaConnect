import React from 'react';
import AvatarCustom from '@/components/avatar/AvatarCustom';
import Name from '@/components/avatar/Name';
import { Button } from '@/components/ui/Button';
import { FaSearch } from 'react-icons/fa';
import useUserZ from '@/zustand/useUserZ';
import { Link } from 'react-router-dom';

const ListSearch = ({ items, currentUser, onFollowToggle }) => {
    const { followUser } = useUserZ();

    const handleFollowToggle = async (userId) => {
        const updated = await followUser(userId);
        if (updated) {
            onFollowToggle(userId);
        }
    };

    if (!items) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                    <FaSearch className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Find Your Friends</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                    Enter a username to search and connect with people you may know
                </p>
            </div>
        );
    }

    if (items?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                    <FaSearch className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Results Found</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                    Try searching with a different username or keyword
                </p>
            </div>
        );
    }

    return (
        <div className='min-h-[calc(100vh-200px)]'>
            <div className="sticky top-0 bg-white/80 backdrop-blur-sm px-6 py-3 border-b border-gray-100">
                <p className="text-sm text-gray-500 font-medium">Found {items?.length} users</p>
            </div>
            <div className="divide-y divide-gray-100">
                {items?.map((item) => {
                    const isFollowing = item?.followers?.some(follower => follower._id === currentUser?._id);
                    return (
                        <div key={item._id}
                            className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-all duration-200 group"
                        >
                            {/* Avatar Section */}
                            <Link to={`/profile/${item._id}`} className="shrink-0">
                                <AvatarCustom
                                    user={{ _id: item?._id, avatarUrl: item?.avatarUrl }}
                                    className="w-12 h-12 ring-2 ring-purple-100 group-hover:ring-purple-200 transition-all duration-200"
                                />
                            </Link>

                            {/* Info Section */}
                            <div className="flex-grow min-w-0">
                                <Link to={`/profile/${item._id}`}>
                                    <Name
                                        user={{ _id: item?._id, username: item?.username }}
                                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                    />
                                </Link>
                                {item?.full_name && (
                                    <p className="text-sm text-gray-500 truncate">{item.full_name}</p>
                                )}
                                <div className="flex items-center gap-4 mt-1">
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium text-gray-900">{item?.followers?.length}</span> followers
                                    </p>
                                    {item?.description && (
                                        <p className="text-sm text-gray-500 truncate flex-1">{item.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Follow Button */}
                            <div className="shrink-0">
                                <Button
                                    onClick={() => handleFollowToggle(item._id)}
                                    className={`min-w-[100px] h-9 transition-all duration-200 ${
                                        isFollowing
                                            ? 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md'
                                    }`}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ListSearch;
