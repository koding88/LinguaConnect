import React, { useState } from 'react';
import AvatarCustom from '@/components/avatar/AvatarCustom';
import Name from '@/components/avatar/Name';
import { Button } from '@/components/ui/Button';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useGroupZ from '@/zustand/useGroupZ';

const ListGroup = ({ items, currentUser }) => {
    const [memberGroups, setMemberGroups] = useState([]);
    const { joinGroup } = useGroupZ();

    if (!items) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <FaSearch className="mx-auto text-4xl mb-2" />
                <p>Enter a group name to search</p>
            </div>
        );
    }

    const handleJoinGroup = async (groupId) => {
        await joinGroup(groupId);
        setMemberGroups([...memberGroups, groupId]);
    }

    return (
        <div className='border-b border-[#D5D5D5] p-4 w-full'>
            {items?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <FaSearch className="mx-auto text-4xl mb-2" />
                    <p>No groups found</p>
                </div>
            ) : (
                <>
                    <p className="text-gray-600 mb-4">Showing {items?.length} results:</p>
                    {items?.map((item) => {
                        const isMember = item?.members?.some(member => member._id === currentUser?._id) || 
                                       memberGroups.includes(item._id) ||
                                       item?.owner === currentUser?._id;
                        return (
                            <div key={item._id} className="w-full relative flex items-center mb-4">
                                <div className="ml-[28px]">
                                    <AvatarCustom user={{ _id: item?._id, avatarUrl: item?.avatarUrl }} />
                                </div>
                                <div className="ml-4 flex flex-col flex-grow">
                                    <Name user={{ _id: item?._id, username: item?.name }} createdAt={null} />
                                    <div className="text-[#999999] text-sm font-normal mt-1">{item?.description}</div>
                                    <div className="text-black text-sm font-normal mt-1">{item?.members?.length} members</div>
                                </div>
                                <div className="flex gap-2 mr-[28px]">
                                    {isMember ? (
                                        <Link to={`/groups/${item._id}`}>
                                            <Button
                                                className="w-24 h-8 text-sm font-normal rounded-md bg-white text-black hover:bg-black hover:text-white border border-black"
                                            >
                                                View
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button
                                            onClick={() => handleJoinGroup(item._id)}
                                            className="w-24 h-8 text-sm font-normal rounded-md bg-black text-white"
                                        >
                                            Join
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default ListGroup;
