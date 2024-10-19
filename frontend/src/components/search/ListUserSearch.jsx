import React from 'react';
import AvatarCustom from '@/components/avatar/AvatarCustom';
import Name from '@/components/avatar/Name';
import { Button } from '@/components/ui/Button';
import { FaSearch } from 'react-icons/fa';
import useUserZ from '@/zustand/useUserZ';

const ListSearch = ({ items, type = 'user', currentUser, onFollowToggle }) => {
    const { followUser } = useUserZ();

    const handleFollowToggle = async (userId) => {
        const updated = await followUser(userId);
        if (updated) {
            onFollowToggle(userId);
        }
    };

    if (!items) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <FaSearch className="mx-auto text-4xl mb-2" />
                <p>Enter a {type} name to search</p>
            </div>
        );
    }

    return (
        <div className='border-b border-[#D5D5D5] p-4 w-full'>
            {items?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <FaSearch className="mx-auto text-4xl mb-2" />
                    <p>No {type}s found</p>
                </div>
            ) : (
                <>
                    <p className="text-gray-600 mb-4">Showing {items?.length} results:</p>
                    {items?.map((item) => {
                        const isFollowing = item?.followers?.some(follower => follower._id === currentUser?._id); // Check if currentUser is following the item
                        return (
                            <div key={item._id} className="w-full relative flex items-center mb-4">
                                <div className="ml-[28px]">
                                    <AvatarCustom user={{ _id: item?._id, avatarUrl: item?.avatarUrl }} />
                                </div>
                                <div className="ml-4 flex flex-col flex-grow">
                                    <Name user={{ _id: item?._id, username: item?.username || item?.name }} createdAt={null} />
                                    {type === 'user' ? (
                                        <>
                                            <div className="text-[#999999]/60 text-sm font-medium mt-1">{item?.full_name}</div>
                                            <div className="text-black text-sm font-normal mt-1">{item?.followers?.length} followers</div>
                                            <div className="text-black text-sm font-normal mt-1">{item?.description}</div>
                                        </>
                                    ) : (
                                        <div className="text-black text-sm font-normal mt-1">{item?.members?.length} members</div>
                                    )}
                                </div>
                                <Button
                                    className={`w-24 h-8 mr-[28px] text-sm font-normal rounded-md ${
                                        isFollowing ? 'bg-white text-black hover:bg-black hover:text-white border border-black' : 'bg-black text-white'
                                    }`}
                                    onClick={() => handleFollowToggle(item._id)}
                                >
                                    {isFollowing ? 'Unfollow' : (type === 'user' ? 'Follow' : 'Join')}
                                </Button>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default ListSearch;
